import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Package,
  Users,
  ShieldCheck,
  Truck,
  HeartHandshake,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">FruitERP</span>
            </div>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link
              to="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              to="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              to="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
            <Link
              to="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About Us
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
        <div className="space-y-4">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            #1 Fruit Wholesale Management Platform
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Wholesale Management <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            A comprehensive SaaS platform for fruit wholesalers to manage
            inventory, sales, and finances in one place. Trusted by over 500+
            businesses worldwide.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
          <Link to="/login">
            <Button size="lg" className="gap-1.5">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="#features">
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&q=80"
              alt="Company logo"
              className="h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&q=80"
              alt="Company logo"
              className="h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&q=80"
              alt="Company logo"
              className="h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&q=80"
              alt="Company logo"
              className="h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-24 sm:py-32">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features for Wholesalers
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Everything you need to manage your wholesale business efficiently.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-primary/10 p-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Inventory Management</h3>
            <p className="text-muted-foreground">
              Track stock levels, lot numbers, and damage reports in real-time
              with automated alerts for low stock.
            </p>
            <Link
              to="#"
              className="text-primary hover:underline mt-2 text-sm font-medium"
            >
              Learn more →
            </Link>
          </div>
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-primary/10 p-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Multi-tenant System</h3>
            <p className="text-muted-foreground">
              Manage multiple businesses with complete data isolation,
              role-based access control, and enterprise-grade security.
            </p>
            <Link
              to="#"
              className="text-primary hover:underline mt-2 text-sm font-medium"
            >
              Learn more →
            </Link>
          </div>
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-primary/10 p-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Financial Analytics</h3>
            <p className="text-muted-foreground">
              Get actionable insights into sales trends, profit margins, and
              outstanding payments with customizable dashboards.
            </p>
            <Link
              to="#"
              className="text-primary hover:underline mt-2 text-sm font-medium"
            >
              Learn more →
            </Link>
          </div>
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-primary/10 p-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Logistics Management</h3>
            <p className="text-muted-foreground">
              Streamline your supply chain with integrated shipping, delivery
              tracking, and route optimization tools.
            </p>
            <Link
              to="#"
              className="text-primary hover:underline mt-2 text-sm font-medium"
            >
              Learn more →
            </Link>
          </div>
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-primary/10 p-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Compliance & Quality</h3>
            <p className="text-muted-foreground">
              Ensure food safety compliance with built-in quality control
              checklists and certification management.
            </p>
            <Link
              to="#"
              className="text-primary hover:underline mt-2 text-sm font-medium"
            >
              Learn more →
            </Link>
          </div>
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-full bg-primary/10 p-4">
              <HeartHandshake className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Customer Relationship</h3>
            <p className="text-muted-foreground">
              Build stronger relationships with integrated CRM tools, automated
              communications, and customer portals.
            </p>
            <Link
              to="#"
              className="text-primary hover:underline mt-2 text-sm font-medium"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container py-24 sm:py-32 bg-muted/50">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            Pricing
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Choose the plan that's right for your business. All plans include a
            14-day free trial.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          {/* Starter Plan */}
          <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Starter</h3>
              <p className="text-muted-foreground">
                Perfect for small businesses
              </p>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$49</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Billed annually or $59 monthly
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "1 Tenant",
                "Up to 500 Products",
                "Basic Analytics",
                "Email Support",
                "Mobile App Access",
                "Standard Reports",
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-8">Start Free Trial</Button>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm ring-2 ring-primary relative hover:shadow-md transition-shadow">
            <div className="absolute -top-4 left-0 right-0 mx-auto w-fit bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
              Most Popular
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Professional</h3>
              <p className="text-muted-foreground">For growing businesses</p>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$99</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Billed annually or $119 monthly
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "3 Tenants",
                "Unlimited Products",
                "Advanced Analytics",
                "Priority Support",
                "API Access",
                "Custom Reports",
                "Team Collaboration Tools",
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-8">Start Free Trial</Button>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Enterprise</h3>
              <p className="text-muted-foreground">For large organizations</p>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$249</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Billed annually or $299 monthly
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Unlimited Tenants",
                "Unlimited Products",
                "Custom Analytics",
                "24/7 Support",
                "API Access",
                "Custom Integrations",
                "Dedicated Account Manager",
                "On-premise Deployment Option",
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-8">Contact Sales</Button>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Need a custom solution?{" "}
            <Link to="#" className="text-primary font-medium hover:underline">
              Contact our sales team
            </Link>{" "}
            for a tailored package.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container py-24 sm:py-32">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Trusted by Wholesalers Worldwide
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            See what our customers have to say about how FruitERP has
            transformed their businesses.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-5 w-5 fill-primary"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-muted-foreground italic">
              "This platform has transformed how we manage our wholesale
              business. The inventory tracking is precise and the multi-tenant
              feature allows us to manage all our locations efficiently. We've
              seen a 30% reduction in inventory waste."
            </p>
            <div className="mt-6 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">JS</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">John Smith</p>
                <p className="text-sm text-muted-foreground">
                  CEO, Fresh Fruits Co.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-5 w-5 fill-primary"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-muted-foreground italic">
              "The financial analytics have given us insights we never had
              before. We've increased our profit margins by 15% since
              implementing this system. The customer support team has been
              exceptional throughout our onboarding process."
            </p>
            <div className="mt-6 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">SJ</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">
                  Operations Manager, Global Produce
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-5 w-5 fill-primary"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-muted-foreground italic">
              "As we expanded to multiple locations, FruitERP made it seamless
              to manage our entire operation. The damage tracking feature alone
              saved us thousands in the first month. I highly recommend this
              platform to any wholesaler."
            </p>
            <div className="mt-6 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">RL</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Robert Lee</p>
                <p className="text-sm text-muted-foreground">
                  Director, Tropical Fruits Inc.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="#" className="text-primary font-medium hover:underline">
            Read more customer stories →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 sm:py-32 bg-primary/5">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            Get Started Today
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Streamline Your Wholesale Operations?
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Join thousands of wholesalers who have transformed their business
            with our platform. Start your 14-day free trial today, no credit
            card required.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
            <Link to="/login">
              <Button size="lg" className="gap-1.5">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="#pricing">
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container py-24 sm:py-32">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            FAQ
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Find answers to common questions about our platform.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 py-12">
          {[
            {
              question: "How does the 14-day free trial work?",
              answer:
                "You can sign up for a full-featured 14-day trial without providing any payment information. At the end of your trial, you can choose a plan that fits your needs or cancel without any charges.",
            },
            {
              question: "Can I switch plans later?",
              answer:
                "Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new features will be immediately available. When downgrading, changes will take effect at the start of your next billing cycle.",
            },
            {
              question: "Is my data secure in a multi-tenant environment?",
              answer:
                "Absolutely. Our platform is built with enterprise-grade security. Each tenant's data is completely isolated with strict access controls, encryption at rest and in transit, and regular security audits.",
            },
            {
              question: "Do you offer custom integrations?",
              answer:
                "Yes, our Enterprise plan includes custom integrations with your existing systems. Our team will work with you to ensure seamless data flow between FruitERP and your other business tools.",
            },
            {
              question: "What kind of support do you offer?",
              answer:
                "All plans include email support. Professional plans include priority support with faster response times, while Enterprise customers receive 24/7 support and a dedicated account manager.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <p className="mt-2 text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <Link to="#" className="text-primary font-medium hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="container py-24 sm:py-32 bg-muted/30">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            About Us
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Built by Wholesalers, for Wholesalers
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            With over 15 years of experience in the fruit wholesale industry,
            our team understands your unique challenges.
          </p>
        </div>
        <div className="mx-auto max-w-5xl py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-muted-foreground mb-4">
              FruitERP was born out of frustration with existing software
              solutions that didn't address the specific needs of fruit
              wholesalers. Our founder, having managed a wholesale business for
              over a decade, decided to build the solution he wished he had.
            </p>
            <p className="text-muted-foreground mb-4">
              Today, we're proud to serve hundreds of wholesale businesses
              across 20+ countries, helping them streamline operations, reduce
              waste, and increase profitability.
            </p>
            <div className="flex gap-4 mt-6">
              <Link to="#">
                <Button variant="outline">Meet Our Team</Button>
              </Link>
              <Link to="#">
                <Button variant="outline">Our Mission</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"
              alt="Team working together"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-8 py-12 md:flex-row md:gap-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">FruitERP</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Wholesale management made simple. Streamline your operations and
              grow your business.
            </p>
            <div className="flex gap-4 mt-2">
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold">Product</h4>
              <Link
                to="#features"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </Link>
              <Link
                to="#pricing"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Integrations
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                API
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold">Resources</h4>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Documentation
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Guides
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Support
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Webinars
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold">Company</h4>
              <Link
                to="#about"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Careers
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold">Legal</h4>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Cookie Policy
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                GDPR
              </Link>
            </div>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-between gap-4 border-t py-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FruitERP. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              to="#"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cookie Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
