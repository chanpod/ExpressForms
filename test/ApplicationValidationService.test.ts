import { ApplicationValidationService } from "~/services/ApplicationValidation.service";


describe('ApplicationValidationService', () => {
    let service: ApplicationValidationService;

    beforeEach(() => {
        service = new ApplicationValidationService();
    });

    describe('validateApplicationForm', () => {
        it('should return null when all fields are valid', () => {
            const application = {
                name: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                dob: '2000-01-01',
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zip: '12345',
                },
                vehicles: [],
            };

            const result = service.validateApplicationForm(application);

            expect(result).toBeNull();
        });

        it('should return errors when fields are invalid', () => {
            const application = {
                name: '',
                firstName: '',
                lastName: '',
                dob: '2005-01-01',
                address: {
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                },
                vehicles: [],
            };

            const result = service.validateApplicationForm(application);

            expect(result).toEqual({
                name: 'Required',
                firstName: 'Required',
                lastName: 'Required',
                dob: undefined,
                address: {
                    "city": "Required",
                    "state": "Required",
                    "street": "Required",
                    "zip": "Required",
                },
                vehicles: undefined,
            });
        });
    });

    describe('validateApplication', () => {
        it('should return null when all fields are valid', () => {
            const application = {
                name: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                dob: '2000-01-01',
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zip: '12345',
                },
                vehicles: [
                    {
                        id: 1,
                        make: 'Toyota',
                        model: 'Corolla',
                        year: 2010,
                        remove: false,
                        vin: '12345678901234567',
                    }
                ],
            };

            const result = service.validateApplication(application);

            expect(result).toBeNull();
        });

        it('should return errors when fields are invalid', () => {
            const application = {
                name: '',
                firstName: '',
                lastName: '',
                dob: undefined,
                address: {
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                },
                vehicles: [],
            };

            const result = service.validateApplication(application);

            expect(result).toEqual({
                name: 'Required',
                firstName: 'Required',
                lastName: 'Required',
                dob: 'Invalid Date. Must be at least 16 years old',
                address: {
                    "city": "Required",
                    "state": "Required",
                    "street": "Required",
                    "zip": "Required",
                },
                vehicles: 'Required',
            });
        });

        it('should ignore removed vehicles', () => {
            const application = {
                name: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                dob: '2000-01-01',
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zip: '12345',
                },
                vehicles: [
                    {
                        id: 1,
                        make: 'Toyota',
                        model: 'Corolla',
                        year: 2010,
                        remove: true,
                        vin: '12345678901234567',
                    },
                    {
                        id: 2,
                        make: 'Honda',
                        model: 'Civic',
                        year: 2015,
                        remove: false,
                        vin: '12345678901234568',
                    },
                ],
            };

            const result = service.validateApplication(application);

            expect(result).toBeNull();
        });
    });

    describe('validateVin', () => {
        it('should return null when VIN is valid', () => {
            const vin = '1GNEK13Z23R298984';

            const result = service.validateVin(vin);

            expect(result).toBeUndefined();
        });

        it('should return error when VIN is not 17 characters', () => {
            const vin = '1GNEK13Z23R29898';

            const result = service.validateVin(vin);

            expect(result).toEqual('Must be 17 characters. Currently 16');
        });

        it('should return error when VIN is not alphanumeric', () => {
            const vin = '1GNEK13Z23R29898!';

            const result = service.validateVin(vin);

            expect(result).toEqual('Must be alphanumeric');
        });
    });

    describe('validateYear', () => {
        it('should return null when year is valid', () => {
            const year = 2000;

            const result = service.validateYear(year);

            expect(result).toBeUndefined();
        });

        it('should return error when year is less than 1985', () => {
            const year = 1984;

            const result = service.validateYear(year);

            expect(result).toEqual('Must be at least 1985');
        });

        it('should return error when year is greater than current year + 1', () => {
            const year = new Date().getFullYear() + 2;

            const result = service.validateYear(year);

            expect(result).toEqual(`Must be less than ${new Date().getFullYear() + 2}`);
        });
    });

    describe('validateName', () => {
        it('should return null when name is valid', () => {
            const name = 'John Doe';

            const result = service.validateName(name);

            expect(result).toBeUndefined();
        });

        it('should return error when name is less than 3 characters', () => {
            const name = 'Jo';

            const result = service.validateName(name);

            expect(result).toEqual('Must be at least 3 characters');
        });

        it('should return error when name is greater than 30 characters', () => {
            const name = 'John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe John Doe';

            const result = service.validateName(name);

            expect(result).toEqual('Must be less than 30 characters');
        });

        it('should return error when name is not alphanumeric', () => {
            const name = 'John Doe!';

            const result = service.validateName(name);

            expect(result).toEqual('Must be alphanumeric');
        });
    });

    describe('completedApplication', () => {
        it('should return true when application is completed', () => {
            const application = {
                name: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                dob: '2000-01-01',
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zip: '12345',
                },
                vehicles: [
                    {
                        id: 1,
                        make: 'Toyota',
                        model: 'Corolla',
                        year: 2010,
                        vin: '12345678901234567',
                    },
                ],
            };

            const result = service.compleqtedApplication(application);

            expect(result).toBe(true);
        });

        it('should return false when application is not completed', () => {
            const application = {
                name: '',
                firstName: '',
                lastName: '',
                dob: '2005-01-01',
                address: {
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                },
                vehicles: [],
            };

            const result = service.completedApplication(application);

            expect(result).toBe(false);
        });
    });
});