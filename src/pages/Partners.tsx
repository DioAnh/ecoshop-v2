import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Award, Users, TrendingUp, Handshake, Target } from 'lucide-react';
import Header from '@/components/Header';

const Partners = () => {
  const partnerCategories = [
    {
      title: "Manufacturing Partners",
      icon: <Store className="w-6 h-6" />,
      description: "Manufacturers committed to sustainability",
      partners: [
        "Green Fashion Co.",
        "Organic Food Vietnam",
        "Eco Home Solutions",
        "Sustainable Tech Ltd."
      ]
    },
    {
      title: "Logistics Partners",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Green transportation network",
      partners: [
        "Green Delivery Network",
        "Eco Logistics VN",
        "Electric Fleet Services",
        "Carbon Neutral Transport"
      ]
    },
    {
      title: "Technology Partners",
      icon: <Target className="w-6 h-6" />,
      description: "Sustainable technology solutions",
      partners: [
        "Smart IoT Solutions",
        "Green Tech Innovations",
        "Sustainable AI Lab",
        "Eco Analytics Platform"
      ]
    }
  ];

  const benefits = [
    {
      title: "Market Expansion",
      description: "Reach customers interested in green products",
      icon: <Users className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Green Certification",
      description: "Recognized as a sustainable business",
      icon: <Award className="w-8 h-8 text-green-600" />
    },
    {
      title: "Marketing Support",
      description: "Promote products on the EcoShop platform",
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />
    },
    {
      title: "Training & Consulting",
      description: "Support green transition for businesses",
      icon: <Target className="w-8 h-8 text-orange-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
              <Handshake className="w-8 h-8 text-primary" />
              Partners
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Building a sustainable business ecosystem together, creating value for the community and environment
            </p>
          </div>

          {/* Partner Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {partnerCategories.map((category, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.partners.map((partner, partnerIndex) => (
                      <div key={partnerIndex} className="p-2 bg-secondary/20 rounded-md text-sm">
                        {partner}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Partnership Benefits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Partnership Benefits</CardTitle>
              <CardDescription className="text-center">
                Values we bring to our partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      {benefit.icon}
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partnership Process */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Process</CardTitle>
                <CardDescription>
                  Steps to become an EcoShop partner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Register</h4>
                      <p className="text-sm text-muted-foreground">
                        Fill out the registration form and submit business information
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Evaluate</h4>
                      <p className="text-sm text-muted-foreground">
                        Review sustainability standards and product quality
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Sign</h4>
                      <p className="text-sm text-muted-foreground">
                        Cooperation agreement and partnership contract signing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Deploy</h4>
                      <p className="text-sm text-muted-foreground">
                        Support setup and start doing business on the platform
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partner Criteria</CardTitle>
                <CardDescription>
                  Requirements to become our partner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Commitment to sustainable development</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Eco-friendly products</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Green manufacturing process</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">International quality certification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Long-term ESG vision</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Compatible with EcoShop values</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-eco-light/20 border-primary/20">
            <CardContent className="text-center py-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to become a partner?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Build a sustainable future together. Contact us to explore partnership opportunities.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Register as a Partner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Partners;