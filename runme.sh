#!/bin/bash

# Handle command line arguments

case $1 in

    # Compile everything
    -c|-compile)
        echo "Compiling TutorProfileService.."
        mkdir -p compiled/TutorService
        javac -cp "libs/*" -d compiled/TutorService src/TutorService/*.java

        echo "Compiling UserServiceMain.."
        mkdir -p compiled/UserService
        javac -cp "libs/*" -d compiled/UserService src/UserService/*.java

        echo "Compiling StudentService.."
        mkdir -p compiled/StudentService
        javac -cp "libs/*" -d compiled/StudentService src/StudentService/*.java

        echo "Compiling ISCS.."
        mkdir -p compiled/ISCS
        javac -cp "libs/*" -d compiled/ISCS src/ISCS/*.java

        echo "Successfully Compiled Everything!"
        ;;

    # Clean up compiled files
    -clean)
        echo "Cleaning up.."
        rm -rf compiled
        echo "Cleaned up!"
        ;;

    # Help Message
    -help|-h)
        echo "Usage: ./runme.sh [OPTION]"
        echo "Options:"
        echo "  -help | -h        Display this help message"
        echo "  -c | -compile     Compile everything"
        echo "  -clean            Clean up compiled files"
        echo "  -tp               Start Tutor Profile Service"
        ;;

    # Start tutor profile service
    -tp)
        echo "Starting Tutor Profile Service.."
        if [[ "$OSTYPE" == "msys" ]]; then
            java -cp "compiled/TutorService;libs/*" TutorService.TutorProfileService
        else
            java -cp "compiled/TutorService:libs/*" TutorService.TutorProfileService
        fi
        ;;

    # Start user profile service
    -up)
        echo "Starting User Profile Service.."
        if [[ "$OSTYPE" == "msys" ]]; then
            java -cp "compiled/UserService;libs/*" UserService.UserServiceMain
        else
            java -cp "compiled/UserService:libs/*" UserService.UserServiceMain
        fi
        ;;

    # Start Student profile service
    -sp)
        echo "Starting Student Profile Service.."
        if [[ "$OSTYPE" == "msys" ]]; then
            java -cp "compiled/StudentService;libs/*" StudentService.StudentServiceMain
        else
            java -cp "compiled/StudentService:libs/*" StudentService.StudentServiceMain
        fi
        ;;

    # Start ISCS service
    -ip)
        echo "Starting ISCS Service.."
        if [[ "$OSTYPE" == "msys" ]]; then
            java -cp "compiled/ISCS;libs/*" ISCS.ISCS
        else
            java -cp "compiled/ISCS:libs/*" ISCS.ISCS
        fi
        ;;

    *)
        echo "Incorrect Usage"
        exit 1
        ;;

esac