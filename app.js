const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
} = require("graphql");

const app = express();

const universities = [
  { id: 1, name: "UNIKIN" },
  { id: 2, name: "UNILU" },
  { id: 3, name: "ISIPA" },
  { id: 4, name: "UPN" },
];

const students = [
  { id: 1, firstName: "Joseph", lastName: "Madras", univID: 1 },
  { id: 2, firstName: "Sacré", lastName: "Mbiku", univID: 1 },
  { id: 3, firstName: "Félix", lastName: "Tshisekedi", univID: 1 },
  { id: 4, firstName: "Augustin", lastName: "Matata", univID: 2 },
  { id: 5, firstName: "Agathe", lastName: "Kitoko", univID: 2 },
  { id: 6, firstName: "Emma", lastName: "Luala", univID: 3 },
  { id: 7, firstName: "Arslène", lastName: "Tshiko", univID: 3 },
  { id: 8, firstName: "Alice", lastName: "Nkoto", univID: 3 },
  { id: 9, firstName: "Philippe", lastName: "Kanku", univID: 4 },
  { id: 10, firstName: "Randy", lastName: "Buhendwa", univID: 4 },
  { id: 11, firstName: "Medi", lastName: "Kaka", univID: 4 },
];

const StudentType = new GraphQLObjectType({
  name: "Student",
  description: "Represents a student",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    univID: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    message: {
      type: GraphQLString,
      resolve: () => "Bonjour à tous",
    },
    students: {
      type: GraphQLList(StudentType),
      description: "List of all students",
      resolve: () => students,
    },
    student: {
      type: StudentType,
      description: "Single Student",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        students.find((student) => student.id == args.id),
    },
  }),
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  description: "Root Mutation",
  fields: () => ({
    addStudent: {
      type: StudentType,
      description: "add a student",
      args: {
        firstName: { type: GraphQLNonNull(GraphQLString) },
        lastName: { type: GraphQLNonNull(GraphQLString) },
        univID: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, { firstName, lastName, univID }) => {
        const student = {
          id: students.length + 1,
          firstName,
          lastName,
          univID,
        };

        students.push(student);
        return student;
      },
    },
    deleteStudent: {
      type: GraphQLList(StudentType),
      description: "Deletes student",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, { id }) => {
        const student = students.find((student) => student.id == id);
        students.splice(students.indexOf(student), 1);
        return students;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

app.use(
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => console.log("Server is running on port 5000"));
