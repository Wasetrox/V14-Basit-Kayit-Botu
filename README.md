![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

# Discord Registration Bot

Discord Registration Bot, sunucunuza yeni katılan üyeleri kaydetmek, güvenilirliklerini kontrol etmek ve gerekli rolleri atamak için tasarlanmış bir bottur. Ayrıca, cinsiyet ve yaş bilgisiyle kayıt yapma, otomatik tag ekleme ve kayıt işlemleri sırasında log mesajları gönderme özelliklerine sahiptir.

## Özellikler

- **Kullanıcı Kaydı:** Slash komutlarıyla kullanıcıları kayıt edin, isim ve opsiyonel olarak yaş bilgisi ekleyin.
- **Cinsiyetli Kayıt:** Kullanıcıları cinsiyetlerine göre (erkek/kız) kaydedin ve ilgili rolleri atayın.
- **Güvenilirlik Kontrolü:** Hesap güvenliğini (hesap 1 aydan eski mi?) kontrol edin ve sonuçları gösterin.
- **Hoş Geldin Mesajları:** Yeni katılan üyelere hoş geldin mesajı gönderin ve onları kaydolmaya teşvik edin.
- **Otomatik Tag:** Yeni kayıt olan kullanıcılara otomatik olarak belirli bir tag ekleyin.
- **Durum Güncellemeleri:** Botun durumu her 5 saniyede bir değişir ve farklı yayın mesajları gösterir.

## Kurulum

### Gereksinimler

- Node.js v16.9.0 veya üzeri
- NPM

### Adımlar

1. **Depoyu Klonlayın:**

    ```bash
    git clone https://github.com/username/discord-registration-bot.git
    cd discord-registration-bot
    ```

2. **Bağımlılıkları Kurun:**

    ```bash
    npm install
    ```

3. **Config Dosyasını Ayarlayın:**

    `config.json` dosyasını kendi sunucunuza ve botunuza uygun şekilde düzenleyin:

    ```json
    {
        "token": "",
        "guildId": "",
        "logChannelId": "",
        "welcomeChannelId": "",
        "registerChannelId": "",
        "unregisteredRoleId": "",
        "registeredRoleId": "",
        "maleRoleId": "",
        "femaleRoleId": "",
        "kayitliRolId": "",
        "tag": "",
        "autoTag": true,
        "unregisteredName": "",
        "voiceChannelId": ""
    }
    ```

4. **Botu Başlatın:**

    ```bash
    npm start
    ```

5. **Komutları Yükleyin:**

    Botun ilk başlatılmasında, komutları Discord sunucunuza kaydettirin. Bu işlem otomatik olarak `ready` olayında gerçekleşecektir.

## Kullanım

### Komutlar

- **`/register`**: Bir kullanıcıyı isim ve opsiyonel olarak yaş bilgisiyle kaydeder.
- **`/register-gender`**: Bir kullanıcıyı cinsiyetine göre (erkek/kız) kaydeder ve yaş bilgisi ekler.
- **`/oto-tag`**: Yeni kayıt olan bir kullanıcıya otomatik olarak tag ekler.
- **`/yardim`**: Botun tüm komutlarını ve kullanım detaylarını gösterir.

### Olaylar

- **`guildMemberAdd`**: Sunucuya yeni bir üye katıldığında kullanıcının ismini `unregisteredName` ile değiştirir ve kayıtsız rolü atar. Ayrıca bir embed mesajıyla hesabın güvenli olup olmadığını gösterir.

## Katkıda Bulunma

Eğer bu botu geliştirmek veya hata raporu yapmak isterseniz, lütfen bir `issue` açın veya bir `pull request` gönderin.

## Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

## İletişim
[Discord Sunucumuz](https://discord.gg/gGX6WBUZzM)