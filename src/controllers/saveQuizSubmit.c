#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#ifndef BUF_SIZE
#define BUF_SIZE 300
#endif

/*
======NOTICE======
THIS C FILE IS THE ORIGINAL FILE OF THE saveQuizSubmit.exe
THIS C FILE IS COMPILED WITHOUT THE COUNTERMEASURES FOR BUFFER OVERFLOW
THIS C FILE ALSO HAS -g FLAG FOR HELPING DEBUGGING
SHOULD YOU WISH TO RECREATE THE EXE FILE RUN
gcc -fno-stack-protector -D_FORTIFY_SOURCE=0 -no-pie -z norelro -g saveQuizSubmit.c -o saveQuizSubmit.exe
ALSO YOU SHOULD SET THE ASLR DISABLED.
*/

int load_to_lecture(char *submit_file_name, char *submit_text)
{
    char buffer[BUF_SIZE];
    char file_directory[100];
    /* The following statement has a buffer overflow problem */
    strcpy(buffer, submit_text);

    snprintf(file_directory, sizeof(file_directory), "./uploads/%s", submit_file_name);

    // write the submitted text to a more organized filename foramt
    FILE *file = fopen(file_directory, "w");
    fwrite(buffer, sizeof(char), strlen(buffer), file);
    fclose(file);

    return 0;
}

int main(int argc, char *argv[])
{
    // temp filename saved by the server
    char *filename = argv[1];
    char *lecture_name = argv[2];
    char *student_id = argv[3];

    // student input is copied to here then sent to load_to_lecture to be copied
    char submit_text[1000];
    memset(submit_text, 0, 1000);
    printf("%s", lecture_name);
    // pointer for sumitted file
    FILE *file;

    // get the file saved by the server -> raw state
    char file_location[50];
    snprintf(file_location, sizeof(file_location), "./uploads/temp/%s", filename);

    // submit file_name => lectureName_studentId.txt
    char submit_file_name[100];
    snprintf(submit_file_name, sizeof(submit_file_name), "%s/%s_%s.txt", lecture_name, lecture_name, student_id);
    printf("%s", submit_file_name);
    file = fopen(file_location, "r");
    fread(submit_text, sizeof(char), 1000, file);
    fclose(file);

    load_to_lecture(submit_file_name, submit_text);

    return 0;
}