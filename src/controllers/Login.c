#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#ifndef BUF_SIZE
#define BUF_SIZE 100
#endif

// Function to shift characters back by one position
void shift_char_back(char *str)
{
    if (str == NULL)
        return;

    while (*str != '\0')
    {
        if ((*str >= 'b' && *str <= 'z') || (*str >= 'B' && *str <= 'Z'))
        {
            *str = *str - 1;
        }
        else if (*str == 'a')
        {
            *str = 'z';
        }
        else if (*str == 'A')
        {
            *str = 'Z';
        }
        str++;
    }
}
int main(int argc, char *argv[])
{
    if (argc != 3)
    {
        fprintf(stderr, "Usage: %s <encrypted_id> <encrypted_password>", argv[0]);
        return 1;
    }

    // get encoded id & pw
    char *encrypted_id = argv[1];
    char *encrypted_password = argv[2];
    char decrypted_id[BUF_SIZE], decrypted_password[BUF_SIZE];

    // Ensure the strings do not exceed buffer size
    strcpy(decrypted_id, encrypted_id);
    strcpy(decrypted_password, encrypted_password);

    // Null-terminate the strings
    decrypted_id[BUF_SIZE - 1] = '\0';
    decrypted_password[BUF_SIZE - 1] = '\0';

    // Shift the characters back to their original values
    shift_char_back(decrypted_id);
    shift_char_back(decrypted_password);

    printf("%s %s", decrypted_id, decrypted_password);
    return 0;
}