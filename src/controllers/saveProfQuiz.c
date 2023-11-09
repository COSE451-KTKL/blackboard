#include <stdlib.h>
#include <stdio.h>
#include <string.h>

int save_quiz(char *submit_file_directory, char *professor, char *lecture_name, char *quiz, char *answer)
{
    char file_directory[100];
    char answer_buffer[100];

    snprintf(file_directory, sizeof(file_directory), "/docker/uploads/lectures/%s", submit_file_directory);
    snprintf(answer_buffer, sizeof(answer_buffer), "answer: %s", answer);

    // write the submitted text to a more organized filename foramt
    FILE *file = fopen(file_directory, "w");
    fprintf(file, "Professor: %s\n Lecture: %s\n", professor, lecture_name);
    fprintf(file, "quiz: ");
    fprintf(file, quiz);
    fprintf(file, "\n%s", answer_buffer);
    fclose(file);

    return 0;
}
// Function format
int exploit()
{
    printf("[Team xxx] Dummy Function for PoC\n");
}

int main(int argc, char *argv[])
{
    // temp filename saved by the server
    char *lecture_name = argv[1];
    char *professor = argv[2];
    char *quiz = argv[3];
    char *answer = argv[4];
    int code;
    char submit_file_directory[100];
    snprintf(submit_file_directory, sizeof(submit_file_directory), "%s/quiz/original_quiz.txt", lecture_name);

    code = save_quiz(submit_file_directory, professor, lecture_name, quiz, answer);
    if (code != 0)
        return -1;
    else
        return 0;
}