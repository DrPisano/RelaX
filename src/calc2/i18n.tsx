/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18next from 'i18next';
import * as LanguageDetector from 'i18next-browser-languagedetector';
import * as React from 'react';
import { langDE } from '../locales/de';
import { langEN } from '../locales/en';
import { langES } from '../locales/es';

export type LanguageKeys = keyof typeof langEN;

export const i18n = i18next
	.use(LanguageDetector)
	.init({
		// we init with resources
		resources: {
			en: {
				translations: langEN,
			},
			de: {
				translations: langDE,
			},
			es: {
				translations: langES,
			},
		},
		fallbackLng: 'en',

		nsSeparator: ':',
		keySeparator: false,
		defaultNS: 'translations',
		debug: true,
	});

export function t(key: LanguageKeys, options?: { [key: string]: string | number }): string {
	return i18n.t(key, options);
}

const {
	Provider,
	Consumer,
} = React.createContext(i18n);

/**
 * exposes the i18n instance
 */
export const I18NProvider: React.SFC<{}> = props => {
	return (
		<Provider value={i18n}>
			{props.children}
		</Provider>
	);
};

/**
 * translate the given id via the i18n instance of the context
 */
export const T: React.SFC<{ id: LanguageKeys, html?: boolean }> = ({ id, html = false }) => {
	return (
		<Consumer>
			{_i18n => (
				html
					? <span dangerouslySetInnerHTML={{ __html: _i18n.t(id, { interpolation: { escapeValue: false } }) }} />
					: <span>{_i18n.t(id)}</span>
			)}
		</Consumer>
	);
};
