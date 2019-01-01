# Açıklama

Bu kod node.js tabanlıdır. İstanbul'un günlük olarak tüm nöbetçi eczanelerinin verisini çekmenizi sağlamaktadır.

## Kurulum

Konsoldan projenin bulunduğu konuma gelerek aşağıda ki komutu çalıştırmanız gerekmektedir. Bu komut projenin gereksinimlerini yüklemektedir.

`npm install` ya da kısaca `npm i`

## Kullanım şekilleri

Kodu çalıştırırken belirli opsiyonlar bulunmaktadır. Bunlar; "srv", "json", "ftp", "db" ve "" tur. Bu opsiyonları komut satırında vermeniz gerekmektedir.
Opsiyon birlikte kullanılabilir. Herhangi bir düzeni yoktur. Aralarında boşluk olucak şekilde komut satırında belirtebilirsiniz.

Örn:

`node istanbul.js "srv" "json" "ftp"` vb.

#### Konsolda Görüntüleme

`node istanbul.js`

Eczaneleri konsolda JSON tipinde görüntüler.

#### JSON Dosyası Olarak Kaydetme

`node istanbul.js "json"`

Eczaneleri istanbul_**günün tarihi**.json olarak kodun bulunduğu konuma dosya olarak kaydeder.

#### Uzak Sunucuya Veri Yükleme

`node istanbul.js "ftp"`

Eczaneleri sizin belirliyeceğiniz bir sunucuya bağlantı kurarak yükleme işlemini gerçekleştirecektir; kaydedilecek dosya .json tipindedir.
Bu kodu çalıştırmadan önce host.json dosyasını gerekli bilgilerle düzenlemeniz gerekmektedir.

Örn:

```json
{
    "host": "example.com",
    "user": "user",
    "password": "123456",
    "port": 21
}
```

#### Veritabanına Veriyi Kaydetme

`node istanbul.js "db"`

Eczaneleri veritabanına kaydetmek için bu işlemi kullanmanız gerekmektedir. Veritabanında tablonuzu aşağıdaki gibi oluşturabilirsiniz.

MySQL:

```mysql
CREATE TABLE IF NOT EXISTS `eczane`.`eczane` (
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
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
```

Bu işlem ardından database bilgilerini db.json dosyasından düzenleyiniz.

Örn: 

```json
{
    "host": "localhost",
    "user": "root",
    "password": "eczane",
    "database": "eczane",
    "debug": false
}
```

#### Kodun Amazon EC2 vb. Sunucularda Çalıştırılması

Kodu görüntüleme erişiminin olmadığı sunucularda,

`node istanbul.js "srv"` olarak çalıştırmanız gerekmektedir. Aksi takdirde hata ile karşılaşılması muhtemeldir.


#### Kodun Otomatik Olarak Günlük Çalıştırılması

`forever start index.js`

Kodu günün belirlenen saatte otomatik olarak çalışmasını sağlayacaktır. Bu işlemi durdurmak için yapmanız gereken;

`forever stopall`

Kodun hangi saatte ve ne şekilde çalışacağını index.js dosyasından ayarlayabilirsiniz.

Örn:

```javascript
var cron = require('cron');
var cmd = require("node-cmd");

var job1 = new cron.CronJob({
    cronTime: '00 09 10 * * *', // Her gün saat 9:10'da kod çalışacaktır.
    onTick: function () {
        cmd.get('node ./istanbul.js "srv" "json" "ftp" "db"', function (err, data, stderr) { // Çalışma tipi "srv" "json" "ftp" "db"

            console.log("Bot çalıştırıldı");
        });

    },
    start: true,
    timeZone: 'Europe/Istanbul'
});
```






