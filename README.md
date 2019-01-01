# Açıklama

Bu kod node.js tabanlıdır. İstanbul'un günlük olarak tüm nöbetçi eczanelerinin verisini çekmenizi sağlamaktadır.

## Kurulum

Konsoldan projenin bulunduğu konuma gelerek aşağıda ki komutu çalıştırmanız gerekmektedir. Bu komut projenin gereksinimlerini yüklemektedir.

`npm install` ya da kısaca `npm i`

## Kullanım şekilleri

Kodu çalıştırırken belirli opsiyonlar bulunmaktadır. Bunlar; "srv", "json", "ftp", "db" ve "" tur. Bu opsiyonları komut satırında vermeniz gerekmektedir.

`node istanbul.js`

Eczaneleri konsolda JSON halinde görüntüler.

`node istanbul.js "json"`

Eczaneleri istanbul_**günün tarihi**.json olarak kodun bulunduğu konuma dosya olarak kaydeder.

`node istanbul.js "ftp"`

Eczaneleri sizin belirliyeceğiniz bir sunucuya bağlantı kurarak yükleme işlemini gerçekleştirecektir.
Bu kodu çalıştırmadan önce host.json dosyasını gerekli bilgilerle düzenlemeniz gerekmektedir.

Örn:

**{
    "host": "example.com",
    "user": "user",
    "password": "123456",
    "port": 21
}**

`node istanbul.js "db"`

Eczaneleri veritabanına kaydetmek için bu işlemi kullanmanız gerekmektedir. Veritabanı tipini aşağıdaki gibi oluşturabilirsiniz.

MySQL:

**CREATE TABLE IF NOT EXISTS `eczane` (
  `id` (11) NOT NULL,
  `name` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `date` DATE NULL DEFAULT NULL,
  `city` VARCHAR(400) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `town` VARCHAR(400) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `address` VARCHAR(400) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `phone` VARCHAR(400) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `latitude` VARCHAR(400) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `longitude` VARCHAR(400) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)**
 
Bu işlem ardından database bilgilerini db.json dosyasından düzenleyiniz.

Örn: 

**{
    "host": "localhost",
    "user": "root",
    "password": "eczane",
    "database": "eczane",
    "debug": false
}**




