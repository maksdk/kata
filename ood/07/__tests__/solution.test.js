/* eslint-disable no-underscore-dangle */

import util from 'util';
import Course from '../Course.js';
import protect from '../solution.js';

const hexletCourse = {
    name: 'Объектно-ориентированный дизайн',
    language: 'JS',
    created: new Date(),
};

test('Using Proxy', () => {
    const course = protect(new Course(hexletCourse));
    expect(util.types.isProxy(course)).toBe(true);
});

test('Check getters', () => {
    const course = protect(new Course(hexletCourse));
    expect(course.language).toEqual(hexletCourse.language);
    expect(course.created).toEqual(hexletCourse.created);
    expect(course.getName()).toEqual(`${hexletCourse.language}: ${hexletCourse.name}`);
});

test('Check getters direct access', () => {
    const course = protect(new Course(hexletCourse));
    expect(() => course._created).toThrow();
    expect(() => course._getCreated()).toThrow();
    expect(() => course._name).toThrow();
});

test('Check setters', () => {
    const course = protect(new Course(hexletCourse));
    const language = 'JavaScript';
    const name = 'Object-oriented design';

    expect(() => {
        course.language = language;
    }).not.toThrow();
    expect(course.language).not.toEqual(hexletCourse.language);
    expect(course.language).toEqual(language);
    expect(course.getName()).toEqual(`${language}: ${hexletCourse.name}`);

    expect(() => {
        course.setName(name);
    }).not.toThrow();
    expect(course.getName()).not.toEqual(`${language}: ${hexletCourse.name}`);
    expect(course.getName()).toEqual(`${language}: ${name}`);

    expect(() => {
        course.getName = function getName() {
            return this._name;
        };
    }).not.toThrow();
    expect(course.getName()).toEqual(name);
});

test('Check setters direct access', () => {
    const course = protect(new Course(hexletCourse));
    expect(() => {
        course._name = 'OOD';
    }).toThrow();
    expect(course.getName()).toEqual(`${hexletCourse.language}: ${hexletCourse.name}`);

    expect(() => {
        course.created = new Date('01.01.2001');
    }).toThrow();
    expect(course.created).toEqual(hexletCourse.created);

    expect(() => {
        course._getCreated = function _getCreated() {
            return this._name;
        };
    }).toThrow();
    expect(course.created).toEqual(hexletCourse.created);
});

test('Check nonexistent properties', () => {
    const course = protect(new Course(hexletCourse));
    expect(() => course._language).toThrow();
    expect(() => course._duration).toThrow();
    expect(() => course.name).toThrow();
    expect(() => course.getLanguage()).toThrow();
    expect(() => course._getLanguage()).toThrow();
});