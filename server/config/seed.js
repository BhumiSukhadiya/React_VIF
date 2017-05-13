/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import _ from 'lodash';
import * as Promise from 'bluebird';

import ApplicationSetting from '../api/applicationSetting/applicationSetting.model';
import Role from '../api/role/role.model';
import Position from '../api/position/position.model';
import StatePrefix from '../api/statePrefix/statePrefix.model';
import ParentCompany from '../api/parentCompany/parentCompany.model';
import Rooftop from '../api/rooftop/rooftop.model';
import User from '../api/user/user.model';

fillApplicationSettings()
    .then(prevData => fillRoles(prevData))
    .then(prevData => fillPositions(prevData))
    .then(prevData => fillStatePrefixes(prevData))
    .then(prevData => fillParentCompany(prevData))
    .then(prevData => fillRooftop(prevData))
    .then(prevData => fillUsers(prevData));

function fillApplicationSettings() {
    let prevData = {};
    return ApplicationSetting.findOne()
        .then((data) => {
            if (!data) {
                return ApplicationSetting.create({
                    applicationName: 'View In Focus',
                    siteURL: 'https://www.viewinfocus.com/',
                    contactEmail: 'contact@viewinfocus.com',
                    contactPhone: '9876543210',
                    decodeVehicleApiUrl: 'https://vpic.nhtsa.dot.gov/api/vehicles',
                    cdnServer: {
                        accessKeyId: 'AKIAJF6DDXUEIJM4GEWA',
                        secretAccessKey: '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',
                        region: 'us-west-1',
                        bucketName: 'staging.genesis.com',
                        serverUrl: 'https://s3-us-west-1.amazonaws.com/staging.genesis.com',
                    },
                    credit700: {
                        baseUrl: 'https://www.700creditsolution.com/XCRS/Service.aspx',
                        account: 'viewfocus',
                        password: 'Test1234'
                    }
                })
                    .then((data) => {
                        console.log('finished populating application setting');
                        prevData.applicationSetting = data;
                        return Promise.resolve(prevData);
                    });
            } else {
                prevData.applicationSetting = data;
                return Promise.resolve(prevData);
            }
        });
}

function fillRoles(prevData) {
    return Role.find()
        .then((data) => {
            if (!data || data.length === 0) {
                return Role.create({
                    name: 'superAdmin',
                    nameSlug: ' Super-Admin',
                    active: true
                }, {
                    name: 'dealerAdmin',
                    nameSlug: 'Dealer-Admin',
                    active: true
                }, {
                    name: 'dealerManager',
                    nameSlug: 'Dealer-Manager',
                    active: true
                }, {
                    name: 'dealerAssociate',
                    nameSlug: 'Dealer-Associate',
                    active: true
                })
                    .then(() => {
                        return Role.find({});
                    })
                    .then((data) => {
                        console.log('finished populating roles');
                        prevData.roles = data;
                        return Promise.resolve(prevData);
                    });
            } else {
                prevData.roles = data;
                return Promise.resolve(prevData);
            }
        })
}

function fillPositions(prevData) {
    let roles = prevData.roles;
    return Position.find()
        .then((data) => {
            if (!data || data.length === 0) {
                return Position.create({
                    name: 'principal',
                    nameSlug: 'Principal',
                    role: _.findLast(roles, {name: 'dealerAdmin'}),
                    active: true
                }, {
                    name: 'generalManager',
                    nameSlug: 'General Manager',
                    role: _.findLast(roles, {name: 'dealerManager'}),
                    active: true
                }, {
                    name: 'generalSalesManager',
                    nameSlug: 'General Sales Manager',
                    role: _.findLast(roles, {name: 'dealerManager'}),
                    active: true
                }, {
                    name: 'salesManager',
                    nameSlug: 'Sales Manager',
                    role: _.findLast(roles, {name: 'dealerManager'}),
                    active: true
                }, {
                    name: 'deskManager',
                    nameSlug: 'Desk Manager',
                    role: _.findLast(roles, {name: 'dealerManager'}),
                    active: true
                }, {
                    name: 'internetSaleManager',
                    nameSlug: 'Internet Manager',
                    role: _.findLast(roles, {name: 'dealerManager'}),
                    active: true
                }, {
                    name: 'serviceManager',
                    nameSlug: 'Service Manager',
                    role: _.findLast(roles, {name: 'dealerManager'}),
                    active: true
                }, {
                    name: 'partsManager',
                    nameSlug: 'Parts Manager',
                    role: _.findLast(roles, {name: 'dealerManager'}),
                    active: true
                }, {
                    name: 'salesperson',
                    nameSlug: 'Salesperson',
                    role: _.findLast(roles, {name: 'dealerAssociate'}),
                    active: true
                }, {
                    name: 'internetSalesperson',
                    nameSlug: 'Internet Salesperson',
                    role: _.findLast(roles, {name: 'dealerAssociate'}),
                    active: true
                }, {
                    name: 'serviceAdvisor',
                    nameSlug: 'Service Advisor',
                    role: _.findLast(roles, {name: 'dealerAssociate'}),
                    active: true
                }, {
                    name: 'partsRep',
                    nameSlug: 'Parts Rep',
                    role: _.findLast(roles, {name: 'dealerAssociate'}),
                    active: true
                })
                    .then(() => {
                        return Position.find({});
                    })
                    .then((data) => {
                        console.log('finished populating positions');
                        prevData.positions = data;
                        return Promise.resolve(prevData);
                    });
            } else {
                prevData.positions = data;
                return Promise.resolve(prevData);
            }
        });
}

function fillStatePrefixes(prevData) {
    return StatePrefix.find()
        .then((data) => {
            if (!data || data.length === 0) {
                return StatePrefix.create(
                    {state: 'Delaware', abbreviation: 'DE', prefix: 1, active: true},
                    {state: 'Pennsylvania', abbreviation: 'PA', prefix: 2, active: true},
                    {state: 'New Jersey', abbreviation: 'NJ', prefix: 3, active: true},
                    {state: 'Georgia', abbreviation: 'GA', prefix: 4, active: true},
                    {state: 'Connecticut', abbreviation: 'CT', prefix: 5, active: true},
                    {state: 'Massachusetts', abbreviation: 'MA', prefix: 6, active: true},
                    {state: 'Maryland', abbreviation: 'MD', prefix: 7, active: true},
                    {state: 'South Carolina', abbreviation: 'SC', prefix: 8, active: true},
                    {state: 'New Hampshire', abbreviation: 'NH', prefix: 9, active: true},
                    {state: 'Virginia', abbreviation: 'VA', prefix: 10, active: true},
                    {state: 'New York', abbreviation: 'NY', prefix: 11, active: true},
                    {state: 'North Carolina', abbreviation: 'NC', prefix: 12, active: true},
                    {state: 'Rhode Island', abbreviation: 'RI', prefix: 13, active: true},
                    {state: 'Vermont', abbreviation: 'VT', prefix: 14, active: true},
                    {state: 'Kentucky', abbreviation: 'KY', prefix: 15, active: true},
                    {state: 'Tennessee', abbreviation: 'TN', prefix: 16, active: true},
                    {state: 'Ohio', abbreviation: 'OH', prefix: 17, active: true},
                    {state: 'Louisiana', abbreviation: 'LA', prefix: 18, active: true},
                    {state: 'Indiana', abbreviation: 'IN', prefix: 19, active: true},
                    {state: 'Mississippi', abbreviation: 'MS', prefix: 20, active: true},
                    {state: 'Illinois', abbreviation: 'IL', prefix: 21, active: true},
                    {state: 'Alabama', abbreviation: 'AL', prefix: 22, active: true},
                    {state: 'Maine', abbreviation: 'ME', prefix: 23, active: true},
                    {state: 'Missouri', abbreviation: 'MO', prefix: 24, active: true},
                    {state: 'Arkansas', abbreviation: 'AR', prefix: 25, active: true},
                    {state: 'Michigan', abbreviation: 'MI', prefix: 26, active: true},
                    {state: 'Florida', abbreviation: 'FL', prefix: 27, active: true},
                    {state: 'Texas', abbreviation: 'TX', prefix: 28, active: true},
                    {state: 'Iowa', abbreviation: 'IA', prefix: 29, active: true},
                    {state: 'Wisconsin', abbreviation: 'WI', prefix: 30, active: true},
                    {state: 'California', abbreviation: 'CA', prefix: 31, active: true},
                    {state: 'Minnesota', abbreviation: 'MN', prefix: 32, active: true},
                    {state: 'Oregon', abbreviation: 'OR', prefix: 33, active: true},
                    {state: 'Kansas', abbreviation: 'KS', prefix: 34, active: true},
                    {state: 'West Virginia', abbreviation: 'WV', prefix: 35, active: true},
                    {state: 'Nevada', abbreviation: 'NV', prefix: 36, active: true},
                    {state: 'Nebraska', abbreviation: 'NE', prefix: 37, active: true},
                    {state: 'Colorado', abbreviation: 'CO', prefix: 38, active: true},
                    {state: 'North Dakota', abbreviation: 'ND', prefix: 39, active: true},
                    {state: 'South Dakota', abbreviation: 'SD', prefix: 40, active: true},
                    {state: 'Montana', abbreviation: 'MT', prefix: 41, active: true},
                    {state: 'Washington', abbreviation: 'WA', prefix: 42, active: true},
                    {state: 'Idaho', abbreviation: 'ID', prefix: 43, active: true},
                    {state: 'Wyoming', abbreviation: 'WY', prefix: 44, active: true},
                    {state: 'Utah', abbreviation: 'UT', prefix: 45, active: true},
                    {state: 'Oklahoma', abbreviation: 'OK', prefix: 46, active: true},
                    {state: 'New Mexico', abbreviation: 'NM', prefix: 47, active: true},
                    {state: 'Arizona', abbreviation: 'AZ', prefix: 48, active: true},
                    {state: 'Alaska', abbreviation: 'AK', prefix: 49, active: true},
                    {state: 'Hawaii', abbreviation: 'HI', prefix: 50, active: true}
                )
                    .then(() => {
                        return StatePrefix.find({});
                    })
                    .then((data) => {
                        console.log('finished populating state prefixes');
                        prevData.statePrefixes = data;
                        return Promise.resolve(prevData);
                    });
            } else {
                prevData.statePrefixes = data;
                return Promise.resolve(prevData);
            }
        })
}

function fillParentCompany(prevData) {
    return ParentCompany.findOne()
        .then((data) => {
            if (!data) {
                return ParentCompany.create({
                        companyId: '01-0001',
                        name: 'HD Thunder Mountain',
                        address: {state: 'DE'},
                        active: true
                    },
                    {
                        companyId: '02-0001',
                        name: 'MZ Marchdiz',
                        address: {state: 'DE'},
                        active: true
                    },
                    {
                        companyId: '03-0001',
                        name: 'TT Audi',
                        address: {state: 'DE'},
                        active: true
                    })
                    .then((data) => {
                        console.log('finished populating parent companies');
                        prevData.parentCompany = data;
                        return Promise.resolve(prevData);
                    });
            } else {
                prevData.parentCompany = data;
                return Promise.resolve(prevData);
            }
        });
}

function fillRooftop(prevData) {
    return Rooftop.findOne()
        .then((data) => {
            if (!data) {
                return Rooftop.create({
                    dealerId: '01-2001',
                    name: 'Thunder Mountain',
                    address: {state: 'DE'},
                    mainPhone: '1234567890',
                    connectionString: 'mongodb://localhost/01-2001',
                    parentCompany: prevData.parentCompany,
                    active: true
                },{
                    dealerId: '01-2002',
                    name: 'Marchdiz',
                    address: {state: 'DE'},
                    mainPhone: '1234567890',
                    connectionString: 'mongodb://localhost/01-2002',
                    parentCompany: prevData.parentCompany,
                    active: true
                },{
                    dealerId: '02-2001',
                    name: 'Audi',
                    address: {state: 'DE'},
                    mainPhone: '1234567890',
                    connectionString: 'mongodb://localhost/02-2001',
                    parentCompany: prevData.parentCompany,
                    active: true
                })
                    .then((data) => {
                        console.log('finished populating rooftops');
                        prevData.rooftop = data;
                        return Promise.resolve(prevData);
                    });
            } else {
                prevData.rooftop = data;
                return Promise.resolve(prevData);
            }
        });
}

function fillUsers(prevData) {
    return User.find()
        .then((data) => {
            if (!data || data.length === 0) {
                return User.create({
                    roles: _.find(prevData.roles, {name: 'dealerAdmin'}),
                    positions: _.find(prevData.positions, {name: 'principal'}),
                    name: {first: 'Dealer', last: 'Admin'},
                    email: 'dadmin@example.com',
                    username: 'dadmin',
                    password: 'changeMe1',
                    rooftops: prevData.rooftop
                }, {
                    roles: _.find(prevData.roles, {name: 'dealerManager'}),
                    positions: _.find(prevData.positions, {name: 'generalManager'}),
                    name: {first: 'Dealer', last: 'Manager'},
                    email: 'dmanager@example.com',
                    username: 'dmanager',
                    password: 'changeMe1',
                    rooftops: prevData.rooftop
                }, {
                    roles: _.find(prevData.roles, {name: 'dealerAssociate'}),
                    positions: _.find(prevData.positions, {name: 'salesperson'}),
                    name: {first: 'Dealer', last: 'Salesperson'},
                    email: 'dsalesperson@example.com',
                    username: 'dsalesperson',
                    password: 'changeMe1',
                    rooftops: prevData.rooftop
                }, {
                    roles: _.find(prevData.roles, {name: 'superAdmin'}),
                    name: {first: 'Rick', last: 'Mcley'},
                    email: 'admin@example.com',
                    username: 'admin',
                    password: 'admin'
                })
                    .then((data) => {
                        console.log('finished populating users');
                        prevData.users = data;
                        return Promise.resolve(prevData);
                    });
            } else {
                prevData.users = data;
                return Promise.resolve(prevData);
            }
        });
}