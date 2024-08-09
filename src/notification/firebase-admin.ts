import * as admin from "firebase-admin";
const serviceAccount = {
  type: "service_account",
  project_id: "dynamic-creative-6a29d",
  private_key_id: "e1165e8049c5968894f7af2b49231b0a87cbf9f5",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqG7/3946c4voY\nRpIN1xAymaOojf0bsTle6d9ceJN/1NzpJ3NdEbuuwCdgMokbhPD3h9t6K6tw2t+B\n9KbstBqBgPRqderCLxdSyh0x7ufnSKwAQ6Y3VwJK+P3ct6tZFm1UQ1DjHvH1fOHF\no5sImnS2/ZZTFUeeg42M9pkP+FOx0GPRqn/nHbGHkU0rMET59unhbCng2LH6C2CH\nRjWLCeq/9ovyLq+el6kzYLx8xcz+kMzf7JFvOJFVkDhtQBHwCWmpRCiFjxzQWJgi\n11fY5ZeZhhF+qoz9URbTvdSjmmmo3VKAfrmYI2j4NzHcT5OGb6uOy+3lTwfbBrnF\nHB6UofIrAgMBAAECggEAREdeLwhhaGycyRiucDq2SDEuJS5U/YQNzKCgJIxLXCCT\nSUyp/B3tkQ+U3oJ6UR7z389a07dqmaJo209ZnyINj5S0xnStNaNUP8lbnZrQ359m\nVrbQpV7Zz0ERGMJqVxhu6scYVQmrQgeN0dhBFtt0ZKz15URh2mjgbMfgmS3qXjDo\nTM/S7JUMI0rVyIS9+A/ERaQ04O63vPbUreAtQzRjWHCkypSzeIdNzTvwgxad4BS+\ncwVSjfq5NeJVreZUkxP0qSShg7HAtwKiggWnINqvcHjT6L4rAZH0sFKvNzTT35ge\nrPGYAhkOiec13SF1n7qSzbz2/GyOZc+XDIdMedRJEQKBgQDlqGmn5FY2pJlwpGhR\nYiAEYQbE0yfc6PeLH4JWSoWRuERskfhVl2ZL0TfCB2VesiQBLYDvHGoIPx8fQMux\nlUGPvey9/yBmQCZJDRk+nlMPWzxSCI4YiQKqXLX26z7osjAMNqlB72CVoqJ1lX9Y\n1IxN7IItejw1DFb8kdxpXAhqcQKBgQC9nr/BA/i9gxh401iFwcu7GdjuN5DWWroj\nl/Bf0K/12ttKbBrKayGEp+BaNGBvon3toRIjwOekRvvM3oCztBvOIhR9LEd/7SV9\n8Sn9HlAjk3QQHO7ZZ6aHL4/D+InMFEuw7c1rcGdNKsrt5VEom0KA6d9lOjqsDT9c\nxrxgjFvcWwKBgDQxOAHN5MH6Wly9IHAOatRT8KPekRqlX0yg1pAh04UwaWx7KALb\nq4XjgFZ6M9F3jrMt0jWFMZu6LKp/oUs0bnfqY9kyF/zk606CyY/vj1TYGTdTdmeh\nC5gIBdqdz+g2RrEf4wt3CW44Tc+HMC/R7ijvbQ5Ez1YG/eXciEjxf4AhAoGBAJpE\nOvEHECjuLMyv9QbtAZi4kJpNrpIVwfYPOMpa96znXx0PEkS4H87S3V3F2uc3pYfc\nUOuxl0M5VMX6B28sCqsLYuvrSEg1YRkzSNva+4vV/MjXISLShtLYyPfAjirwIBxT\ne5n7Gq/XLr2YoQyOM+65Vrv+QZmUNYZ/UOajimCdAoGAR/rtxYuYHwWAWgk+6PsD\nERdUzJaTa8CilgPJB0gG3C1YT1Djb7VxwlLeKBxrfk3nNMN+dc5X99FzMkWnUNng\nKLbrgP66kjiHvcoSG5qWFi8KqxW6GFHpE27R3sE88Uv1roxEE8FPz+1WJUJVN08l\n4fPRaZlBWvuBHS35L2f7aBo=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-88sgm@dynamic-creative-6a29d.iam.gserviceaccount.com",
  client_id: "104596699628569431369",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-88sgm%40dynamic-creative-6a29d.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const serviceAccountKey: any = serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: "https://dynamic-creative-6a29d.firebaseio.com",
});

export const firebaseAdmin = admin;
