#!/bin/bash

# Handle command line arguments

case $1 in

    # Compile everything
    -c|-compile)
        echo "Compiling TutorProfileService.."

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
        ;;

    *)
        echo "Incorrect Usage"
        exit 1
        ;;

esac