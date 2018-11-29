SafeWalk Simulator
====================
#### ISU COM S 409 Prototype Project

SafeWalk Simulator is a team academic project developed as a prototype for a software requirements engineering course.

This project simulates NASA's [SAFER manuevering system](https://www.nasa.gov/missions/shuttle/f_saferspacewalk.html), with a focus on a redesigned Crew Display and Control Module (CDCM), i.e. the hand control module and display unit.

## Installing

Requirements:
1. Make sure you have [NodeJS](https://nodejs.org/en/) installed.

## How to Run:
1. Clone this repository.
2. Navigate to the root directory and run `npm i` to install dependencies.
3. Run `npm run dev` to begin serving on port `8080` of your local host.

## Play Around!

The controls are fairly intuitive:
* Use the simulated trackball to control rotation.
* Use the throttle adjuster to increase power output from thrusters.
* Note that if the thruster level is greater than 0, you are always moving in the camera facing direction.

Returning to the home base model is a win condition.

Running out of oxygen is a lose condition.

Hit Return to Home to automate flight back!

## Visit the Live Product
To view: https://shuffman.com/SafeWalk/


## Maintainers:
 * Scott Huffman
 * Stephen Davidson
 * Kevin Mathis
 * Christopher Bui