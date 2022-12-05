
# set FLASK_APP=server.py
# set FLASK_ENV=development
# FLASK run -p 8000

import os

from numpy import round_
from simpful import *
from flask_cors import CORS, cross_origin
import json
from flask import Flask
from flask import Response, jsonify, request

import pymongo
from pymongo import MongoClient

MONGO_URL = 'mongodb+srv://essamayman:UaM7kxXwCkUCp4pB@optimusevaluation.m3tro.mongodb.net/?retryWrites=true&w=majority'
dbname = 'OptimusEvaluation'
collectionname = 'Student_courses_grades'

base_dir = os.getcwd()
app = Flask(__name__)
CORS(app)

@app.route("/optimus", methods=['POST'])
def optimus():
    if request.method == 'POST':
        attendence = request.get_json().get('attendence', 100)
        internal_marks = request.get_json().get('internal_marks', 100)
        external_marks = request.get_json().get('external_marks', 100)
        student_id = request.get_json().get('student_id')
        course_id = request.get_json().get('course_id')

        connect = MongoClient(MONGO_URL)
        print("database_connected")

        db = connect[dbname]
        collection = db[collectionname]
        
        print(attendence)
        print(internal_marks)
        print(external_marks)
        print(student_id)
        print(course_id)

        grade = ""
        performance = fuzzy(attendence, internal_marks, external_marks)

        if(round(performance) >= 80):
            grade = "A+"
        elif (round(performance) >= 75):
            grade = "A"
        elif (round(performance) >= 70):
            grade = "A-"
        elif (round(performance) >= 65):
            grade = "B+"
        elif (round(performance) >= 60):
            grade = "B"
        elif (round(performance) >= 55):
            grade = "B-"        
        elif (round(performance) >= 50):
            grade = "C+"            
        elif (round(performance) >= 45):
            grade = "C"
        elif (round(performance) >= 40):
            grade = "D"
        else:
            grade = "F"

        print("grade  ", grade)
        myquery = {
            '$and': [
            {'student_id': student_id},
            {'course_id': course_id}
        ]}
        newvalues = {"$set": {"performance": performance , "grade": grade}}
        collection.update_one(myquery, newvalues)
        return Response(json.dumps({'performance': performance}),
                        status=200, mimetype='application/json')
        # return Response()


def fuzzy(attendence, internal_marks, external_marks):

    # A simple fuzzy inference system for the Optimus evaluation system
    # Create a fuzzy system object
    FS = FuzzySystem()

    # Define fuzzy sets and linguistic variables (Fuzzification)
    A_1 = FuzzySet(function=Trapezoidal_MF(a=-5, b=0, c=45, d=55), term="poor")
    A_2 = FuzzySet(function=Trapezoidal_MF(
        a=35, b=45, c=55, d=65), term="average")
    A_3 = FuzzySet(function=Trapezoidal_MF(
        a=45, b=55, c=65, d=75), term="good")
    A_4 = FuzzySet(function=Trapezoidal_MF(
        a=55, b=65, c=75, d=85), term="very_good")
    A_5 = FuzzySet(function=Trapezoidal_MF(
        a=65, b=75, c=100, d=105), term="excellent")
    FS.add_linguistic_variable("Attendence", LinguisticVariable(
        [A_1, A_2, A_3, A_4, A_5], concept="Attendence Grades", universe_of_discourse=[0, 100]))

    I_1 = FuzzySet(function=Trapezoidal_MF(a=-5, b=0, c=40, d=50), term="poor")
    I_2 = FuzzySet(function=Trapezoidal_MF(
        a=30, b=40, c=50, d=60), term="average")
    I_3 = FuzzySet(function=Trapezoidal_MF(
        a=40, b=50, c=60, d=70), term="good")
    I_4 = FuzzySet(function=Trapezoidal_MF(
        a=50, b=60, c=70, d=80), term="very_good")
    I_5 = FuzzySet(function=Trapezoidal_MF(
        a=65, b=75, c=100, d=105), term="excellent")
    FS.add_linguistic_variable("Internal_Marks", LinguisticVariable(
        [I_1, I_2, I_3, I_4, I_5], concept="Internal assessment", universe_of_discourse=[0, 100]))

    E_1 = FuzzySet(function=Trapezoidal_MF(a=-5, b=0, c=40, d=50), term="poor")
    E_2 = FuzzySet(function=Trapezoidal_MF(
        a=30, b=40, c=50, d=60), term="average")
    E_3 = FuzzySet(function=Trapezoidal_MF(
        a=40, b=50, c=60, d=70), term="good")
    E_4 = FuzzySet(function=Trapezoidal_MF(
        a=50, b=60, c=70, d=80), term="very_good")
    E_5 = FuzzySet(function=Trapezoidal_MF(
        a=65, b=75, c=100, d=105), term="excellent")
    FS.add_linguistic_variable("External_Marks", LinguisticVariable(
        [E_1, E_2, E_3, E_4, E_5], concept="External assessment", universe_of_discourse=[0, 100]))

    # Define output fuzzy sets and linguistic variable
    P_1 = FuzzySet(function=Trapezoidal_MF(a=-1, b=0, c=40, d=50), term="poor")
    P_2 = FuzzySet(function=Trapezoidal_MF(
        a=30, b=40, c=50, d=60), term="average")
    P_3 = FuzzySet(function=Trapezoidal_MF(
        a=40, b=50, c=60, d=70), term="good")
    P_4 = FuzzySet(function=Trapezoidal_MF(
        a=50, b=60, c=70, d=80), term="very_good")
    P_5 = FuzzySet(function=Trapezoidal_MF(
        a=65, b=75, c=100, d=110), term="excellent")
    FS.add_linguistic_variable("performance", LinguisticVariable(
        [P_1, P_2, P_3, P_4, P_5], concept="Student's performance", universe_of_discourse=[0, 100]))

    # Define fuzzy rules
    R1 = "IF (Attendence IS poor) AND (Internal_Marks IS poor) AND (External_Marks IS poor) THEN (performance IS poor)"
    R2 = "IF (Attendence IS poor) AND (Internal_Marks IS poor) AND (External_Marks IS average) THEN (performance IS poor)"
    R3 = "IF (Attendence IS poor) AND (Internal_Marks IS poor) AND (External_Marks IS good) THEN (performance IS average)"
    R4 = "IF (Attendence IS poor) AND (Internal_Marks IS poor) AND (External_Marks IS very_good) THEN (performance IS average)"
    R5 = "IF (Attendence IS poor) AND (Internal_Marks IS very_good) AND (External_Marks IS good) THEN (performance IS good)"
    R6 = "IF (Attendence IS poor) AND (Internal_Marks IS average) AND (External_Marks IS poor) THEN (performance IS poor)"
    R7 = "IF (Attendence IS poor) AND (Internal_Marks IS average) AND (External_Marks IS average) THEN (performance IS average)"
    R8 = "IF (Attendence IS poor) AND (Internal_Marks IS average) AND (External_Marks IS good) THEN (performance IS average)"
    R9 = "IF (Attendence IS poor) AND (Internal_Marks IS good) AND (External_Marks IS good) THEN (performance IS good)"
    R10 = "IF (Attendence IS poor) AND (Internal_Marks IS good) AND (External_Marks IS excellent) THEN (performance IS very_good)"
    R11 = "IF (Attendence IS average) AND (Internal_Marks IS good) AND (External_Marks IS average) THEN (performance IS average)"
    R12 = "IF (Attendence IS average) AND (Internal_Marks IS good) AND (External_Marks IS good) THEN (performance IS good)"
    R13 = "IF (Attendence IS average) AND (Internal_Marks IS good) AND (External_Marks IS very_good) THEN (performance IS good)"
    R14 = "IF (Attendence IS average) AND (Internal_Marks IS very_good) AND (External_Marks IS very_good) THEN (performance IS very_good)"
    R15 = "IF (Attendence IS average) AND (Internal_Marks IS excellent) AND (External_Marks IS average) THEN (performance IS good)"
    R16 = "IF (Attendence IS average) AND (Internal_Marks IS average) AND (External_Marks IS average) THEN (performance IS average)"
    R17 = "IF (Attendence IS average) AND (Internal_Marks IS poor) AND (External_Marks IS poor) THEN (performance IS poor)"
    R18 = "IF (Attendence IS average) AND (Internal_Marks IS good) AND (External_Marks IS poor) THEN (performance IS average)"
    R19 = "IF (Attendence IS good) AND (Internal_Marks IS average) AND (External_Marks IS average) THEN (performance IS average)"
    R20 = "IF (Attendence IS good) AND (Internal_Marks IS excellent) AND (External_Marks IS excellent) THEN (performance IS very_good)"
    R21 = "IF (Attendence IS good) AND (Internal_Marks IS average) AND (External_Marks IS good) THEN (performance IS good)"
    R22 = "IF (Attendence IS good) AND (Internal_Marks IS poor) AND (External_Marks IS poor) THEN (performance IS poor)"
    R23 = "IF (Attendence IS very_good) AND (Internal_Marks IS very_good) AND (External_Marks IS excellent) THEN (performance IS very_good)"
    R24 = "IF (Attendence IS very_good) AND (Internal_Marks IS very_good) AND (External_Marks IS very_good) THEN (performance IS very_good)"
    R25 = "IF (Attendence IS very_good) AND (Internal_Marks IS poor) AND (External_Marks IS poor) THEN (performance IS poor)"
    R26 = "IF (Attendence IS very_good) AND (Internal_Marks IS very_good) AND (External_Marks IS good) THEN (performance IS very_good)"
    R27 = "IF (Attendence IS very_good) AND (Internal_Marks IS excellent) AND (External_Marks IS excellent) THEN (performance IS excellent)"
    R28 = "IF (Attendence IS excellent) AND (Internal_Marks IS very_good) AND (External_Marks IS excellent) THEN (performance IS very_good)"
    R29 = "IF (Attendence IS excellent) AND (Internal_Marks IS average) AND (External_Marks IS average) THEN (performance IS very_good)"
    R30 = "IF (Attendence IS excellent) AND (Internal_Marks IS very_good) AND (External_Marks IS average) THEN (performance IS good)"
    R31 = "IF (Attendence IS excellent) AND (Internal_Marks IS good) AND (External_Marks IS average) THEN (performance IS good)"
    R32 = "IF (Attendence IS excellent) AND (Internal_Marks IS poor) AND (External_Marks IS poor) THEN (performance IS poor)"
    R33 = "IF (Attendence IS excellent) AND (Internal_Marks IS poor) AND (External_Marks IS average) THEN (performance IS average)"
    R34 = "IF (Attendence IS excellent) AND (Internal_Marks IS average) AND (External_Marks IS poor) THEN (performance IS poor)"
    R35 = "IF (Attendence IS excellent) AND (Internal_Marks IS poor) AND (External_Marks IS good) THEN (performance IS good)"
    R36 = "IF (Attendence IS excellent) AND (Internal_Marks IS good) AND (External_Marks IS poor) THEN (performance IS average)"
    R37 = "IF (Attendence IS excellent) AND (Internal_Marks IS poor) AND (External_Marks IS very_good) THEN (performance IS very_good)"
    R38 = "IF (Attendence IS excellent) AND (Internal_Marks IS very_good) AND (External_Marks IS poor) THEN (performance IS average)"
    R39 = "IF (Attendence IS excellent) AND (Internal_Marks IS excellent) AND (External_Marks IS poor) THEN (performance IS good)"
    R40 = "IF (Attendence IS excellent) AND (Internal_Marks IS excellent) AND (External_Marks IS average) THEN (performance IS very_good)"
    R41 = "IF (Attendence IS excellent) AND (Internal_Marks IS excellent) AND (External_Marks IS good) THEN (performance IS very_good)"
    R42 = "IF (Attendence IS excellent) AND (Internal_Marks IS excellent) AND (External_Marks IS very_good) THEN (performance IS very_good)"
    R43 = "IF (Attendence IS excellent) AND (Internal_Marks IS excellent) AND (External_Marks IS excellent) THEN (performance IS excellent)"

    FS.add_rules([R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13,
                  R14, R15, R16, R17, R18, R19, R20, R21, R22, R23, R24, R25,
                  R26, R27, R28, R29, R30, R31, R32, R33, R34, R35, R36, R37,
                  R38, R39, R40, R41, R42, R43])

    # Set input values
    # FS.set_variable("Attendence", Attendence*10)
    # FS.set_variable("Internal_Marks", Internal_Marks*2.5)
    # FS.set_variable("External_Marks", External_Marks*2)
    FS.produce_figure
    FS.set_variable("Attendence", attendence)  # input 1
    FS.set_variable("Internal_Marks", internal_marks)  # input 2
    FS.set_variable("External_Marks", external_marks)  # input 3

    # Perform Mamdani inference and print output
    fuzzyResult = FS.Mamdani_inference(['performance'])
    performance = fuzzyResult["performance"]
    print(performance)
    # print(round(fuzzyResult["performance"]))
    # FS.produce_figure("output.png")
    # FS.plot_variable("Attendence")
    # print(FS.get_firing_strengths())

    return performance
