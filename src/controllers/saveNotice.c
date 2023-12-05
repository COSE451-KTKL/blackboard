#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "./uploadNotice.h"

#ifndef BUF_SIZE
#define BUF_SIZE 300
#endif

int save_notice(char *submit_file_name, char *submit_text)
{
    char buffer[BUF_SIZE];
    char file_directory[100];

    strncpy(buffer, submit_text, sizeof(buffer));
    upload_notice(submit_file_name, buffer);

    return 0;
}
// Function format
int exploit()
{
    printf("[Team xxx] Dummy Function for PoC\n");
}

int main(int argc, char *argv[])
{
    char *content = argv[1];
    char *lecture_name = argv[2];
    char *new_notice_id = argv[3];

    char submit_file_name[100];
    snprintf(submit_file_name, sizeof(submit_file_name), "%s/notice/%s_%s.txt", lecture_name, lecture_name, new_notice_id);
    printf("%s", submit_file_name);

    save_notice(submit_file_name, content);

    return 0;
}