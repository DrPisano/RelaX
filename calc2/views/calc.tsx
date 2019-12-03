/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Calculator } from 'calc2/components/calculator';
import * as store from 'calc2/store';
import { Group, GROUPS_LOAD_REQUEST, GROUP_SET_DRAFT } from 'calc2/store/groups';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

type Props = RouteComponentProps<{
	source: string,
	id: string,
	filename: string,
	index: string,
}> & {
	groups: store.State['groups'],
	locale: store.State['session']['locale'],
	setDraft(draft: Group): void,
	loadGroup(
		source: GROUPS_LOAD_REQUEST['source'],
		id: string,
		filename: string,
		index: number,
	): void,
};

export class Calc extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		// start loading group
	}

	componentDidUpdate(prevProps: Props): void {
		const { params } = this.props.match;
		const { params: prevParams } = prevProps.match;
		if (
			false
			|| params.source !== prevParams.source
			|| params.id !== prevParams.id
			|| params.filename !== prevParams.filename
			|| params.index !== prevParams.index
		) {
			// change/load
			this.loadGroup(this.props);
		}
	}

	private loadGroup(props: Props) {
		const { source, id, filename, index } = props.match.params;

		this.props.loadGroup(source, id, filename, Number.parseInt(index));
		// TODO: display errors
	}

	componentWillReceiveProps(nextProps: Props): void {
		const { params } = this.props.match;
		const { params: nextParams } = nextProps.match;
		if (
			false
			|| nextParams.source !== params.source
			|| nextParams.id !== params.id
			|| nextParams.filename !== params.filename
			|| nextParams.index !== params.index
		) {
			// change/load
		}
	}

	render() {
		const { locale } = this.props;
		const { current } = this.props.groups;

		if (current !== null) {
			return (
				<Calculator
					group={current.group}
					locale={locale}
					setDraft={this.props.setDraft}
				/>
			);
		}
		else {
			return <div>loading ...</div>;
		}
	}
}

export const ConnectedCalc = connect((state: store.State) => {
	return {
		groups: state.groups,
		locale: state.session.locale,
	};
}, (dispatch) => {
	return {
		loadGroup: (
			source: GROUPS_LOAD_REQUEST['source'],
			id: string,
			filename: string,
			index: number,
		) => {
			const action: GROUPS_LOAD_REQUEST = {
				type: 'GROUPS_LOAD_REQUEST',
				source,
				id,
				setCurrent: {
					filename,
					index,
				},
			};

			dispatch(action);
		},
		setDraft: (draft: Group) => {
			const action: GROUP_SET_DRAFT = {
				type: 'GROUP_SET_DRAFT',
				draft,
			};
			dispatch(action);
		},
	};
})(Calc);
