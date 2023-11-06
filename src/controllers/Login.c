#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/aes.h>

#ifndef BUF_SIZE
#define BUF_SIZE 20
#endif

// decrypt key
const char *secret_key = "0123456789abcdef0123456789abcdef";

int main(int argc, char *argv[])
{
    if (argc != 3)
    {
        fprintf(stderr, "Usage: %s <encrypted_id> <encrypted_password>\n", argv[0]);
        return 1;
    }

    // get encoded id&pw
    const char *encrypted_id = argv[1];
    const char *encrypted_password = argv[2];

    // AES decrypt
    AES_KEY aes_key;
    AES_set_decrypt_key((const unsigned char *)secret_key, 128, &aes_key);

    // buff overflow problem here
    unsigned char decrypted_id[BUF_SIZE];
    unsigned char decrypted_password[BUF_SIZE];

    AES_decrypt((const unsigned char *)encrypted_id, decrypted_id, &aes_key);
    AES_decrypt((const unsigned char *)encrypted_password, decrypted_password, &aes_key);

    printf("%s %s\n", decrypted_id, decrypted_password);
    return 0;
}