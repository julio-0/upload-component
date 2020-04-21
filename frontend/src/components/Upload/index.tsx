/* eslint-disable react/jsx-props-no-spreading */
import filesize from 'filesize';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Dropzone, { DropzoneState } from 'react-dropzone';
import { uniqueId } from 'lodash';
import { ApplicationState } from '../../store';
import { Requisition } from '../../store/ducks/requisition/types';
import * as RequisitionActions from '../../store/ducks/requisition/actions';
import { Styled } from './styles';

import 'react-circular-progressbar/dist/styles.css';

interface StateProps {
  requisitions: Requisition[]
}

interface DispatchProps {
  uploadRequest(requisition: Requisition): void,
}

type Props = StateProps & DispatchProps

class Upload extends Component<Props> {
  componentWillUnmount() {
    const { requisitions } = this.props;
    requisitions.forEach((req) => { if (req.preview) URL.revokeObjectURL(req.preview); });
  }

  renderDragMessage = (state: DropzoneState) => {
    if (!state.isDragActive) {
      return (
        <Styled.UploadMessage type={Styled.messageColors.default}>
          Arraste arquivos aqui ...
        </Styled.UploadMessage>
      );
    }
    if (state.isDragReject) {
      return (
        <Styled.UploadMessage type={Styled.messageColors.error}>
          Arquivo não suportado
        </Styled.UploadMessage>
      );
    }
    return (
      <Styled.UploadMessage type={Styled.messageColors.success}>
        Solte os arquivos aqui ...
      </Styled.UploadMessage>
    );
  }

  handleUpload = (files: File[]) => {
    const reqs: Requisition[] = files.map((file) => ({
      vId: uniqueId(),
      file,
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      type: file.type,
    }));

    reqs.forEach(this.processUpload);
  }

  processUpload = (requisition: Requisition) => {
    const { uploadRequest } = this.props;
    uploadRequest(requisition);
  }

  render() {
    return (
      <Dropzone accept="image/*" onDropAccepted={this.handleUpload}>
        { (state: DropzoneState) => (
          <Styled.DropContainer {...state.getRootProps()} className="dropzone" isDragActive={state.isDragActive} isDragReject={state.isDragReject}>
            <input {...state.getInputProps()} />
            {this.renderDragMessage(state)}
          </Styled.DropContainer>
        )}
      </Dropzone>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  requisitions: state.requisitions.viewdata,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(RequisitionActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
