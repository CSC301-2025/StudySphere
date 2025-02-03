#!/bin/bash

# Handle command line arguments

case $1 in

    # Compile everything
    -c|-compile)
        echo "Compiling TutorProfileService.."
        mkdir -p compiled/TutorService
        javac -cp "libs/*" -d compiled/TutorService src/TutorService/*.java


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

    *)
        echo "Incorrect Usage"
        exit 1
        ;;

esac