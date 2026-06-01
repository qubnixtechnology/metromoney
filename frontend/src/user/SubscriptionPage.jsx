import React from 'react';
import { Check, Crown, ShieldCheck, Sparkles } from 'lucide-react';
import { Button, Card } from '../components/ui';

export default function SubscriptionPage({ plans = [], onSelectPlan }) {
  return (
    <section className="product-page">
      <div className="page-hero compact-hero">
        <span><Crown size={16} /> Premium memberships</span>
        <h1>Unlock safer, faster matchmaking</h1>
        <p>Plans are loaded from the subscription plan database table.</p>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <Card className={plan.id === 'premium' ? 'pricing-card featured-plan' : 'pricing-card'} key={plan.id}>
            <Sparkles />
            <h2>{plan.name}</h2>
            <strong>{Number(plan.price) === 0 ? 'Free' : `Rs. ${plan.price}`}<small> / {plan.period}</small></strong>
            <ul>
              {plan.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}
            </ul>
            <Button variant={plan.id === 'premium' ? 'primary' : 'ghost'} onClick={() => onSelectPlan(plan)}>
              <ShieldCheck size={17} /> Choose plan
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
