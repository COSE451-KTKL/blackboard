#include <stdlib.h>
#include <stdio.h>


int upload_notice(char *submit_file_name, char *buffer)
{
    snprintf(file_directory, sizeof(file_directory), "./uploads/%s", submit_file_name);

    FILE *file = fopen(file_directory, "w");
    fprintf(file, buffer);
    fclose(file);

    return 0;
}