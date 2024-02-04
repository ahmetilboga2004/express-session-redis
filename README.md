# Web Uygulaması Açıklaması: Oturum Yönetimi ve Çoklu Cihaz Desteği

Bu basit web uygulaması, Express.js, Redis ve Sequelize (PostgreSQL ile entegre) kullanarak oturum yönetimi ve çoklu cihaz desteği sağlar. Kullanıcılar oturum açabilir, oturumlarını güvenli bir şekilde yönetebilir ve aynı oturumu farklı cihazlarda kullanabilirler. Temel amacı, bu teknolojilerin nasıl entegre edildiğini anlatarak oturum yönetimi ve çoklu cihaz desteği konularını göstermektir.

## Çalıştırmak

- Kodu çalıştırın: `npm install`
- Postgres Veritabanında `session-app` adında bir veritabanı oluşturun
- Redis sunucunuzu başlatın
- Kodu çalıştırın: `npm start` (Nodemon)

## Özelleştirme

### Veritabanı

`sqlite` `mysql` `postgres` `mssql` `mariadb` `db2` `oracle` gibi başka veritabanları da kullanabilirsiniz.

Sadece `config/database.js` dosyasında gerekli db ayarlarınızı yazmanız yeterlidir.

### Redis

Ben redis clienti için varsayılan redis kullanıcı bilgileri kullandım.

Siz bunu istediğiniz gibi özelleştirebilirsiniz

### Güvenlik

Güvenlik için `helmet` `joi` gibi modüller kullanabilirsiniz.

Ayrıca `SECRET_KEY` ve veritabanı ayarlarını da ortam değişkeni olarak kayıt edebilirsiniz.

Ortam değişkenleri için `dotenv` kullanabilirsiniz.

Çerezler için 1 günlük süre belirledim. Siz isterseniz `app.js` dosyasındaki `maxAge` değerini istediğiniz süreye ayarlayabilirbilirsiniz.
