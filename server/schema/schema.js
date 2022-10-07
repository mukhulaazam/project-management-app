const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql')
const { projects, clients } = require('./sampleData')

const Project = require('../config/models/Project');
const Client = require('../config/models/Client');

// @des :: Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }
        }
    }),
});
// @des :: Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        }
    }
});

// @des :: Mutatuon
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // @des :: Add a Client
        addClient: {
            type: ClientType,
            args: {
                name: new GraphQLNonNull(GraphQLString),
                email: new GraphQLNonNull(GraphQLString),
                phone: new GraphQLNonNull(GraphQLString),
            },
            resolve(parent, id) {
                const client = new Client({
                    name: this.args.name,
                    email: this.args.email,
                    phone: this.args.phone
                });
                return client.save();
            }
        },
        // @des :: Delect a Client
        deleteClient: {
            type: ClientType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Client.findByIdAndDelete(args.id);
            }
        },
        // @des :: Project create
        createProject: {
            type: ProjectType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new' : {value: 'Not Started'},
                            'progress' : {value: 'In Progress'},
                            'complete' : {value: 'Complete'},
                        }
                    }),
                    defaultValue: 'Not Started',
                },
                clientId: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, id) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                });
                return project.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
})