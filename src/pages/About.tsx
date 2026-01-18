import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Heart, Target, Users, Award, Globe } from 'lucide-react';
import Header from '@/components/Header';

const About = () => {
  const values = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Sustainable",
      description: "Committed to environmental protection through every product and service"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Responsible",
      description: "Taking responsibility for the community and future generations"
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Innovative",
      description: "Constantly creating green solutions for life"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Community",
      description: "Building a green living community with conscious consumption"
    }
  ];

  const achievements = [
    {
      number: "50,000+",
      label: "Trusted Customers",
      description: "Consumers who chose a green lifestyle"
    },
    {
      number: "1,250",
      label: "Tons CO2 Saved",
      description: "Contributing to carbon emission reduction"
    },
    {
      number: "500+",
      label: "Green Products",
      description: "Diverse sustainable choices"
    },
    {
      number: "100+",
      label: "Partners",
      description: "Businesses sharing the same vision"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Globe className="w-10 h-10 text-primary" />
              About EcoShop
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A pioneering e-commerce platform connecting consumers with sustainable products, contributing to building a green future for the planet.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Target className="w-6 h-6" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To create a smart shopping platform where every transaction contributes positively to the environment. We connect conscious consumers with businesses committed to sustainable development, creating a green and lasting economic ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Award className="w-6 h-6" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading green e-commerce platform in the region, where shopping not only meets personal needs but also contributes to protecting the planet. Everyone can easily choose a sustainable lifestyle through our products and services.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Core Values</CardTitle>
              <CardDescription className="text-center">
                The principles guiding all our activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      {value.icon}
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                GreenPoints system and positive impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Shop Green</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose sustainable products from environmentally conscious producers
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Earn Green Points</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive GreenPoints based on the product's eco-friendliness level
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Redeem Rewards</h4>
                  <p className="text-sm text-muted-foreground">
                    Use points to redeem vouchers and continue your green journey
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Our Achievements</CardTitle>
              <CardDescription className="text-center">
                Impressive numbers on positive impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {achievement.number}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {achievement.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Our Team</CardTitle>
              <CardDescription className="text-center">
                Passionate people building a sustainable future
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center max-w-4xl mx-auto">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  EcoShop is built by a diverse team of experts in technology, sustainability, and business. We share a common belief that technology can be a powerful tool to create positive changes for the environment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Tech Team</h4>
                    <p className="text-sm text-muted-foreground">
                      Developing a modern, secure, and user-friendly platform
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">ESG Experts</h4>
                    <p className="text-sm text-muted-foreground">
                      Ensuring sustainability standards and assessing environmental impact
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Business Team</h4>
                    <p className="text-sm text-muted-foreground">
                      Building partnerships and developing the market
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;