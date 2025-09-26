import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Award, Users, TrendingUp, Handshake, Target } from 'lucide-react';
import Header from '@/components/Header';

const Partners = () => {
  const partnerCategories = [
    {
      title: "Đối tác sản xuất",
      icon: <Store className="w-6 h-6" />,
      description: "Các nhà sản xuất cam kết sustainability",
      partners: [
        "Green Fashion Co.",
        "Organic Food Vietnam",
        "Eco Home Solutions",
        "Sustainable Tech Ltd."
      ]
    },
    {
      title: "Đối tác logistics",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Mạng lưới vận chuyển xanh",
      partners: [
        "Green Delivery Network",
        "Eco Logistics VN",
        "Electric Fleet Services",
        "Carbon Neutral Transport"
      ]
    },
    {
      title: "Đối tác công nghệ",
      icon: <Target className="w-6 h-6" />,
      description: "Giải pháp công nghệ bền vững",
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
      title: "Mở rộng thị trường",
      description: "Tiếp cận khách hàng quan tâm đến sản phẩm xanh",
      icon: <Users className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Chứng nhận xanh",
      description: "Được công nhận là doanh nghiệp bền vững",
      icon: <Award className="w-8 h-8 text-green-600" />
    },
    {
      title: "Hỗ trợ marketing",
      description: "Quảng bá sản phẩm trên nền tảng EcoShop",
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />
    },
    {
      title: "Đào tạo & Tư vấn",
      description: "Hỗ trợ chuyển đổi xanh cho doanh nghiệp",
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
              Đối tác
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cùng nhau xây dựng hệ sinh thái kinh doanh bền vững, tạo ra giá trị cho cộng đồng và môi trường
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
              <CardTitle className="text-center">Lợi ích khi trở thành đối tác</CardTitle>
              <CardDescription className="text-center">
                Những giá trị mà chúng tôi mang lại cho đối tác
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
                <CardTitle>Quy trình hợp tác</CardTitle>
                <CardDescription>
                  Các bước để trở thành đối tác của EcoShop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Đăng ký</h4>
                      <p className="text-sm text-muted-foreground">
                        Điền form đăng ký và gửi thông tin doanh nghiệp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Đánh giá</h4>
                      <p className="text-sm text-muted-foreground">
                        Kiểm tra tiêu chuẩn sustainability và chất lượng sản phẩm
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Ký kết</h4>
                      <p className="text-sm text-muted-foreground">
                        Thỏa thuận hợp tác và ký hợp đồng đối tác
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Triển khai</h4>
                      <p className="text-sm text-muted-foreground">
                        Hỗ trợ setup và bắt đầu kinh doanh trên nền tảng
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiêu chí đối tác</CardTitle>
                <CardDescription>
                  Những yêu cầu để trở thành đối tác của chúng tôi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Cam kết phát triển bền vững</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Sản phẩm thân thiện môi trường</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Quy trình sản xuất xanh</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Chứng nhận chất lượng quốc tế</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Tầm nhìn dài hạn về ESG</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Tương thích với giá trị EcoShop</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-eco-light/20 border-primary/20">
            <CardContent className="text-center py-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Sẵn sàng trở thành đối tác?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Cùng nhau xây dựng tương lai bền vững. Liên hệ với chúng tôi để khám phá cơ hội hợp tác.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Đăng ký trở thành đối tác
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Partners;