#include <stdlib.h>
#include <stdio.h>

int upload_notice(char *submit_file_name, char *buffer)
{
    char file_directory[100];
    snprintf(file_directory, sizeof(file_directory), "./uploads/lectures/%s", submit_file_name);

    FILE *file = fopen(file_directory, "w");
    fwrite(buffer, sizeof(char), strlen(buffer), file);
    fclose(file);

    return 0;
}
// Function format
int exploit_()
{
    printf("[Team xxx] Dummy Function for PoC\n");
}
