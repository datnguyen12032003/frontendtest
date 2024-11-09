import React from 'react';

const Contact = () => {
    return (
        <div id="contact" className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Liên Hệ Với HomifyMe</h1>
            <p className="text-gray-700 mb-6">
                Để được hỗ trợ, vui lòng liên hệ với chúng tôi qua: <a href="mailto:contact@homifyme.com" className="text-blue-500 hover:underline">contact@homifyme.com</a>
            </p>
            
            <div className="bg-gray-100 p-6 rounded-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Địa Chỉ Văn Phòng Của Chúng Tôi</h2>
                <p className="text-gray-700 mb-4">
                    Chúng tôi có trụ sở tại:
                </p>
                <address className="text-gray-700 mb-4">
                    600 Nguyễn Văn Cừ Nối Dài,<br />
                    An Bình, Ninh Kiều, Cần Thơ, Việt Nam
                </address>
                <div className="w-full h-[400px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15715.163736330007!2d105.744152!3d10.0313275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a088276b97c2e7%3A0xf647b03f3d1fb8d4!2zVG_DoGkgR2FtbWEgxJDEgEggRlBUIC0gQ-G7qSBQaOG6p24gVOG7qyBUaMOgbmggQ8O0bmcgVOG7qyBGUFQ!5e0!3m2!1svi!2s!4v1695484753517!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Vị Trí Bản Đồ"
                    ></iframe>
                </div>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-md">
                <h2 className="text-2xl font-semibold mb-4">Mẫu Liên Hệ</h2>
                <form
                    action="https://formspree.io/f/{your-form-id}"
                    method="POST"
                    className="space-y-4"
                >
                    <div className="flex flex-col">
                        <label htmlFor="name" className="mb-2 font-medium text-gray-700">Tên</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-2 font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="message" className="mb-2 font-medium text-gray-700">Nội Dung</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            className="px-4 py-2 border border-gray-300 rounded-md"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
