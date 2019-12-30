import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';

import Student from '../pages/Student';
import StudentForm from '../pages/StudentForm';

import Plan from '../pages/Plan';
import PlanForm from '../pages/PlanForm';

import Enrollment from '../pages/Enrollment';
import EnrollmentForm from '../pages/EnrollmentForm';

import HelpOrder from '../pages/HelpOrder';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/students" exact component={Student} isPrivate />
      <Route path="/students/add" exact component={StudentForm} isPrivate />
      <Route path="/students/:id" exact component={StudentForm} isPrivate />

      <Route path="/plans" exact component={Plan} isPrivate />
      <Route path="/plans/add" exact component={PlanForm} isPrivate />
      <Route path="/plans/:id" exact component={PlanForm} isPrivate />

      <Route path="/enrollments" exact component={Enrollment} isPrivate />
      <Route
        path="/enrollments/add"
        exact
        component={EnrollmentForm}
        isPrivate
      />
      <Route
        path="/enrollments/:id"
        exact
        component={EnrollmentForm}
        isPrivate
      />

      <Route path="/help-orders" exact component={HelpOrder} isPrivate />
    </Switch>
  );
}
