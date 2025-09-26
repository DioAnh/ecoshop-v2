import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Heart, Target, Users, Award, Globe } from 'lucide-react';
import Header from '@/components/Header';

const About = () => {
  const values = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Bền vững",
      description: "Cam kết bảo vệ môi trường qua từng sản phẩm và dịch vụ"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Trách nhiệm",
      description: "Đảm nhận trách nhiệm với cộng đồng và thế hệ tương lai"
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Đổi mới",
      description: "Không ngừng sáng tạo giải pháp xanh cho cuộc sống"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Cộng đồng",
      description: "Xây dựng cộng đồng sống xanh, tiêu dùng có ý thức"
    }
  ];

  const achievements = [
    {
      number: "50,000+",
      label: "Khách hàng tin tưởng",
      description: "Người tiêu dùng đã chọn lối sống xanh"
    },
    {
      number: "1,250",
      label: "Tấn CO2 tiết kiệm",
      description: "Đóng góp vào việc giảm phát thải carbon"
    },
    {
      number: "500+",
      label: "Sản phẩm xanh",
      description: "Đa dạng lựa chọn bền vững"
    },
    {
      number: "100+",
      label: "Đối tác",
      description: "Doanh nghiệp cùng chung tầm nhìn"
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
              Giới thiệu EcoShop
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Nền tảng thương mại điện tử tiên phong trong việc kết nối người tiêu dùng 
              với các sản phẩm bền vững, góp phần xây dựng tương lai xanh cho hành tinh.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Target className="w-6 h-6" />
                  Sứ mệnh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Tạo ra một nền tảng mua sắm thông minh, nơi mọi giao dịch đều đóng góp 
                  tích cực cho môi trường. Chúng tôi kết nối người tiêu dùng có ý thức với 
                  các doanh nghiệp cam kết phát triển bền vững, tạo ra một hệ sinh thái 
                  kinh tế xanh và bền vững.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Award className="w-6 h-6" />
                  Tầm nhìn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Trở thành nền tảng thương mại điện tử xanh hàng đầu khu vực, 
                  nơi việc mua sắm không chỉ đáp ứng nhu cầu cá nhân mà còn 
                  góp phần bảo vệ hành tinh. Mọi người đều có thể dễ dàng lựa chọn 
                  lối sống bền vững thông qua các sản phẩm và dịch vụ của chúng tôi.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Giá trị cốt lõi</CardTitle>
              <CardDescription className="text-center">
                Những nguyên tắc định hướng mọi hoạt động của chúng tôi
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
              <CardTitle>Cách thức hoạt động</CardTitle>
              <CardDescription>
                Hệ thống GreenPoints và tác động tích cực
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Mua sắm xanh</h4>
                  <p className="text-sm text-muted-foreground">
                    Chọn sản phẩm bền vững từ các nhà sản xuất có ý thức môi trường
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Tích điểm xanh</h4>
                  <p className="text-sm text-muted-foreground">
                    Nhận GreenPoints dựa trên mức độ thân thiện môi trường của sản phẩm
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Đổi thưởng</h4>
                  <p className="text-sm text-muted-foreground">
                    Sử dụng điểm để đổi voucher và tiếp tục hành trình xanh
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Thành tựu của chúng tôi</CardTitle>
              <CardDescription className="text-center">
                Những con số ấn tượng về tác động tích cực
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
              <CardTitle className="text-center">Đội ngũ của chúng tôi</CardTitle>
              <CardDescription className="text-center">
                Những người đam mê xây dựng tương lai bền vững
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center max-w-4xl mx-auto">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  EcoShop được xây dựng bởi một đội ngũ đa dạng gồm các chuyên gia về công nghệ, 
                  phát triển bền vững, và kinh doanh. Chúng tôi chia sẻ chung niềm tin rằng 
                  công nghệ có thể là công cụ mạnh mẽ để tạo ra những thay đổi tích cực cho môi trường.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Đội ngũ Công nghệ</h4>
                    <p className="text-sm text-muted-foreground">
                      Phát triển nền tảng hiện đại, an toàn và thân thiện người dùng
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Chuyên gia ESG</h4>
                    <p className="text-sm text-muted-foreground">
                      Đảm bảo tiêu chuẩn bền vững và đánh giá tác động môi trường
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Đội ngũ Kinh doanh</h4>
                    <p className="text-sm text-muted-foreground">
                      Xây dựng mối quan hệ đối tác và phát triển thị trường
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