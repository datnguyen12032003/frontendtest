import React from 'react';

const About = () => {
    return (
        <div id="about" className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Về HomifyMe</h1>
            <p className="text-gray-700 mb-6">
                HomifyMe là một nền tảng tiên phong cung cấp các dịch vụ hỗ trợ và giải pháp nhà ở cho người dùng tại Cần Thơ. Sứ mệnh của chúng tôi là mang đến những trải nghiệm tuyệt vời và đáng tin cậy trong việc tìm kiếm và quản lý không gian sống.
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Sứ Mệnh Của HomifyMe</h2>
                <p className="text-gray-700">
                    Tại HomifyMe, chúng tôi tin tưởng vào việc cung cấp các giải pháp nhà ở hiệu quả và tiện ích cho cộng đồng. Với đội ngũ chuyên nghiệp và nhiệt huyết, chúng tôi luôn cố gắng mang đến cho người dùng các lựa chọn không gian sống tốt nhất, phù hợp với nhu cầu và phong cách cá nhân.
                </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Liên Hệ Với Chúng Tôi</h2>
                <p className="text-gray-700">
                    <strong>Email:</strong> support@homifyme.com
                </p>
                <p className="text-gray-700">
                    <strong>Số điện thoại:</strong> +84 123 456 789
                </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
                <h2 className="text-2xl font-semibold mb-4">Địa Chỉ Của Chúng Tôi</h2>
                <p className="text-gray-700 mb-4">
                    HomifyMe có trụ sở tại Cần Thơ, Việt Nam. Hãy ghé thăm chúng tôi để khám phá các dịch vụ của chúng tôi và tìm kiếm không gian sống hoàn hảo cho bạn.
                </p>
                <div className="w-full h-[400px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.286971163414!2d105.74670691550666!3d10.029021759576876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a085c5f8ae79f1%3A0xf62e634b644a07e2!2zQ2FuIFRo4bq_biDEkMO0IE3Phu59!5e0!3m2!1svi!2s!4v1630489121547!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Bản đồ Cần Thơ"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default About;
