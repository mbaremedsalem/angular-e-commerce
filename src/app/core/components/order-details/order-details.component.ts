import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order, SingleOrderResponse, OrderItem } from '../../services/order.service';
import { environment } from 'src/app/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  apiEndpoint: string;
}

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error: string | null = null;
  activeLanguage: 'fr' | 'ar' = 'fr';
  public apiUrl = `${environment.domain}`;
  
  // Gestion du modal de paiement
  showPaymentModal = false;
  selectedMethod: PaymentMethod | null = null;
  paymentProcessing = false;
  
  paymentMethods: PaymentMethod[] = [
    {
      id: 'bankily',
      name: 'Bankily',
      image: 'bankily.png',
      apiEndpoint: `${environment.domain}/payment/bankily/`
    },
    {
      id: 'masrivi',
      name: 'Masrivi',
      image: 'masrivi.png',
      apiEndpoint: `http://165.227.85.96/ayadi/create_transaction/`
    },
    {
      id: 'saddad',
      name: 'Saddad',
      image: 'saddad.png',
      apiEndpoint: `${environment.domain}/payment/saddad/`
    },
    {
      id: 'bimbanque',
      name: 'Bimbanque',
      image: 'bimbanque.png',
      apiEndpoint: `${environment.domain}/payment/bimbanque/`
    },
    {
      id: 'stripe',
      name: 'Carte Bancaire',
      image: 'stripe.png',
      apiEndpoint: `${environment.domain}/api/create-checkout-session/`
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(+orderId);
    } else {
      this.error = 'Numéro de commande invalide';
      this.loading = false;
    }
  }

  loadOrderDetails(orderId: number): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrderById(orderId).subscribe({
      next: (response: SingleOrderResponse) => {
        this.order = response.order;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Échec du chargement des détails de la commande';
        this.loading = false;
        console.error('Error loading order details:', err);
      }
    });
  }

  switchLanguage(lang: 'fr' | 'ar'): void {
    this.activeLanguage = lang;
  }

  // Type-safe method for address fields
  getTranslated(field: 'street' | 'city' | 'state', lang: 'fr' | 'ar' = this.activeLanguage): string {
    if (!this.order) return '';
    const translatedField = `${field}_${lang}` as const;
    return this.order[translatedField] || '';
  }


  // Safe method to get translated name
  getItemName(item: OrderItem): string {
    switch (this.activeLanguage) {
      case 'fr': return item.name_fr || item.name;
      case 'ar': return item.name_ar || item.name;
      default: return item.name;
    }
  }

// ------


  // Convert price string to number for calculations
  getItemTotal(item: OrderItem): number {
    const price = parseFloat(item.price);
    return isNaN(price) ? 0 : price * item.quantity;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'processing': return 'status-processing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/placeholder-product.png';
    event.target.onerror = null;
  }

  // =========
    // ... autres méthodes existantes ...

  openPaymentModal(): void {
    this.showPaymentModal = true;
    this.selectedMethod = null;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedMethod = null;
    this.paymentProcessing = false;
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
  }

processPayment(): void {
  if (!this.selectedMethod || !this.order) return;

  this.paymentProcessing = true;
  
  // Préparer les données de paiement communes
  const paymentData: any = {
    order_id: this.order.id,
    amount: this.order.total_amount,
    payment_method: this.selectedMethod.id
  };
  // Cas spécifique pour Masrivi
  if (this.selectedMethod.id === 'masrivi') {
    // Créer un formulaire dynamiquement et le soumettre
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = this.selectedMethod.apiEndpoint;
    form.target = '_blank'; // Ouvre dans un nouvel onglet

    // Ajouter les champs nécessaires
    const addField = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    addField('amount', this.order.total_amount.toString());
    addField('currency', '929');
    addField('description', 'Achat de produits');
    // Ajoutez d'autres champs requis par Masrivi ici

    // Ajouter le formulaire à la page et le soumettre
    document.body.appendChild(form);
    form.submit();
    
    // Nettoyer
    setTimeout(() => document.body.removeChild(form), 100);
    
    this.closePaymentModal();
    this.loadOrderDetails(this.order!.id);
    this.paymentProcessing = false;
  }
  // Cas spécifique pour Stripe
  else if (this.selectedMethod.id === 'stripe') {
    // Préparer le corps spécifique pour Stripe
    const stripeData = {
      street: this.order.street_fr || this.order.street_ar || '',
      city: this.order.city_fr || this.order.city_ar || '',
      state: this.order.state_fr || this.order.state_ar || '',
      zip_code: this.order.zip_code || '',
      phone: this.order.phone || '',
      country: 'Mauritania', // À adapter selon vos besoins
      orderItems: this.order.orderItems.map(item => ({
        product: item.product,
        name: this.getItemName(item),
        image: item.image ? `${this.apiUrl}${item.image}` : 'https://192.168.0.220:8000/media/products/iphon1.jpg',
        quantity: item.quantity,
        price: parseFloat(item.price)
      }))
    };
      console.log('les donner dustripe',stripeData);

    this.http.post(this.selectedMethod.apiEndpoint, stripeData)
      .subscribe({
        next: (response: any) => {
          if (response.session && response.session.url) {
            // Ouvrir l'URL de paiement Stripe dans une nouvelle fenêtre
            window.open(response.session.url, '_blank');
            this.closePaymentModal();
          } else {
            this.error = 'Erreur: URL de paiement non reçue';
          }
          this.paymentProcessing = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la connexion au service de paiement';
          console.error('Payment error:', err);
          this.paymentProcessing = false;
        }
      });
  } else {
    // Pour les autres méthodes de paiement
    this.http.post(this.selectedMethod.apiEndpoint, paymentData)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Paiement effectué avec succès!');
            this.closePaymentModal();
            this.loadOrderDetails(this.order!.id);
          } else {
            this.error = response.message || 'Erreur lors du paiement';
          }
          this.paymentProcessing = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la connexion au service de paiement';
          console.error('Payment error:', err);
          this.paymentProcessing = false;
        }
      });
  }
}

}