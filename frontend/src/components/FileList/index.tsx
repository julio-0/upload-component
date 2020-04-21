/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { CircularProgressbar } from 'react-circular-progressbar';
import {
  MdCheckCircle, MdError, MdLink,
} from 'react-icons/md';
import { ApplicationState } from '../../store';
import { Requisition } from '../../store/ducks/requisition/types';
import * as RequisitionActions from '../../store/ducks/requisition/actions';
import { Styled } from './styles';

import 'react-circular-progressbar/dist/styles.css';

interface StateProps {
  requisitions: Requisition[]
}

interface DispatchProps {
  loadRequest(): void,
  deleteRequest(id: string): void,
}

type Props = StateProps & DispatchProps

class FileList extends Component<Props> {
  componentDidMount() {
    const { loadRequest } = this.props;
    loadRequest();
  }

  handleDelete = (id: string) => {
    const { deleteRequest } = this.props;
    deleteRequest(id);
  };

  render() {
    const { requisitions } = this.props;

    return (
      <Styled.List>
        {requisitions.map((requisition) => (
          <Styled.ListItem key={requisition.vId}>
            <Styled.FileInfo>
              <Styled.Preview src={requisition.preview ? requisition.preview : requisition.url} />
              <div>
                <strong>{requisition.name}</strong>
                <span>
                  {requisition.readableSize}
                  {' '}
                  {!!requisition.url && (
                  <button type="button" onClick={() => { if (requisition.id) this.handleDelete(requisition.id); }}>
                    Excluir
                  </button>
                  )}
                </span>
              </div>
            </Styled.FileInfo>
            <div>
              {(!requisition.uploaded && !requisition.url)
                && !requisition.error && (
                <CircularProgressbar
                  styles={{
                    root: { width: 24 },
                    path: { stroke: '#7159c1' },
                  }}
                  value={requisition.progress || 0}
                  strokeWidth={10}
                />
              )}
              {requisition.url && (
              <a
                href={requisition.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MdLink style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
              )}

              {!!requisition.url && <MdCheckCircle size={24} color="#78e5d5" />}
              {(requisition.error) && <MdError size={24} color="#e57878" />}
            </div>
          </Styled.ListItem>
        ))}
      </Styled.List>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  requisitions: state.requisitions.viewdata,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(RequisitionActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
