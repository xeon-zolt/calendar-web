import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, ProgressBar } from 'react-bootstrap';
import moment from 'moment';
import '../css/datetime.css';
import GuestList from './eventGuestList';
import { LoadGuestList, SendInvites } from '../store/eventAction';

var Datetime = require('react-datetime');

class EventDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: this.props.showModal,
            showInvitesModal: false,
            eventDetail: {
                id: this.props.eventType === 'add' ? this.props.newIndex : this.props.eventInfo.id,
                title: this.props.eventInfo && this.props.eventInfo.title ? this.props.eventInfo.title : null,
                start: this.props.eventInfo && this.props.eventInfo.start ? this.props.eventInfo.start : moment(),
                end: this.props.eventInfo && this.props.eventInfo.end ? this.props.eventInfo.end : moment,
                allDay: this.props.eventInfo.allDay ? true : false,
                hexColor: '#265985',
                notes: this.props.eventInfo.notes ? this.props.eventInfo.notes : '',
                guests: this.props.eventInfo.guests ? this.props.eventInfo.guests : ''
            },
            sending: false
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.handleInvitesHide = this.handleInvitesHide.bind(this)
        this.showInvitesModal = this.showInvitesModal.bind(this)
        this.sendInvites = this.sendInvites.bind(this)
        this.addEvent = this.addEvent.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const showInvitesModal = this.state.showInvitesModal
        console.log("showInvitesModal", showInvitesModal, nextProps.inviteSuccess)
        this.setState({
            showModal: nextProps.showModal,
            eventDetail: {
                id: nextProps.eventType === 'add' ? nextProps.newIndex : nextProps.eventInfo.id,
                title: nextProps.eventInfo && nextProps.eventInfo.title ? nextProps.eventInfo.title : '',
                start: new Date(nextProps.eventInfo && nextProps.eventInfo.start ? nextProps.eventInfo.start : moment()),
                end: new Date(nextProps.eventInfo && nextProps.eventInfo.end ? nextProps.eventInfo.end : moment()),
                allDay: nextProps.eventInfo.allDay ? true : false,
                hexColor: nextProps.eventInfo.hexColor ? nextProps.eventInfo.hexColor : '#265985',
                notes: nextProps.eventInfo.notes ? nextProps.eventInfo.notes : '',
                guests: nextProps.eventInfo.guests ? nextProps.eventInfo.guests : '',
                owner: nextProps.eventInfo.owner ? nextProps.eventInfo.owner : ''
            },
            showInvitesModal: showInvitesModal && nextProps.inviteSuccess,
            sending: !!nextProps.inviteSuccess || !!nextProps.inviteError
        });

    }

    changeHandler(e, ref) {
        var eventDetail = this.state.eventDetail;
        var val = '';
        if (ref !== "allDay") {
            if (ref === "start" || ref === "end") {
                val = new Date(moment(e));

            } else {
                val = e.target.value;
            }
        } else {
            val = e.target.checked;
        }

        eventDetail[ref] = val;
        this.setState({ eventDetail });
    }

    addEvent() {
        const eventDetail = this.state.eventDetail
        console.log("add event", eventDetail.noInvites, this.hasGuests(eventDetail.guests))
        if (eventDetail.noInvites || !this.hasGuests(eventDetail.guests)) {
            this.props.addEvent(eventDetail)
        } else {
            this.showInvitesModal()
        }
    }

    hasGuests(guestsString) {
        const guests = guestsString.split(/[,\s]+/g)
        return guests.filter((g) => g.length > 0).length > 0
    }

    showInvitesModal() {
        const guestsString = this.state.eventDetail.guests
        const guests = guestsString.split(/[,\s]+/g)
        console.log("dipatch load guest list", guests)
        this.props.dispatch(LoadGuestList(guests))
        this.setState({ showInvitesModal: true })

    }

    handleInvitesHide() {
        this.setState({ showInvitesModal: false })
        const eventDetail = this.state.eventDetail
        eventDetail.noInvites = true
    }

    sendInvites() {
        this.setState({ sending: true })
        this.props.dispatch(SendInvites(this.state.eventDetail))
    }

    render() {
        const hasGuests = this.state.eventDetail.guests.length > 0
        var inviteErrorMsg = []
        if (this.props.inviteError) {
            const error = this.props.inviteError
            if (error.errcode === "M_CONSENT_NOT_GIVEN") {
                var linkUrl = error.message.substring(error.message.indexOf("https://openintents.modular.im"), error.message.length - 1)
                inviteErrorMsg = (<div>Sending not possible. Please review <a target="_blank" rel="noopener noreferrer" href={linkUrl}>the T&amp;C of your chat provider</a> openintents.modular.im (OI Chat)</div>)
            }
        }
        return (
            <Modal show={this.state.showModal}
                onHide={this.props.handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                        Event Details
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label> Event Name </label>
                    <input type="text" className="form-control" placeholder="Enter the Event Name" ref="title"
                        value={this.state.eventDetail.title} onChange={(e) => this.changeHandler(e, "title")} />

                    <label> Start Date </label>
                    {this.state.eventDetail.allDay ? <Datetime value={this.state.eventDetail.start} dateFormat="MM-DD-YYYY"
                        timeFormat={false} onChange={(e) => this.changeHandler(e, "start")} /> :

                        <Datetime value={this.state.eventDetail.start} onChange={(e) => this.changeHandler(e, "start")} />
                    }

                    <label> End Date </label>
                    {this.state.eventDetail.allDay ? <Datetime value={this.state.eventDetail.end} dateFormat="MM-DD-YYYY"
                        timeFormat={false} onChange={(e) => this.changeHandler(e, "end")} /> :
                        <Datetime value={this.state.eventDetail.end} onChange={(e) => this.changeHandler(e, "end")} />}

                    <label> Event Notes </label>
                    <textarea className="form-control" placeholder="Event Notes" ref="notes" value={this.state.eventDetail.notes}
                        onChange={(e) => this.changeHandler(e, "notes")} />

                    <label> Guests </label>
                    <textarea className="form-control" placeholder="Event guests" ref="guests" value={this.state.eventDetail.guests}
                        onChange={(e) => this.changeHandler(e, "guests")} />

                    <label> Event Color </label>
                    <input type="color" value={this.state.eventDetail.hexColor} onChange={(e) => this.changeHandler(e, "hexColor")}
                        style={{ marginRight: '20px', marginLeft: '5px' }} />

                    <input type="checkBox" name="all_Day"
                        value={this.state.eventDetail.id}
                        checked={this.state.eventDetail.allDay}
                        onChange={(e) => this.changeHandler(e, "allDay")} />
                    <label> All Day </label>

                </Modal.Body>
                <Modal.Footer>
                    {this.props.eventType === 'add' ? null : <Button bsStyle="warning" enabled={{ hasGuests }} onClick={() => this.showInvitesModal()}>Send Invites</Button>}
                    {this.props.eventType === 'add' ? <Button bsStyle="success" onClick={() => this.addEvent()}>Add</Button> :
                        <Button bsStyle="warning" onClick={() => this.props.updateEvent(this.state.eventDetail)}>Update</Button>}
                    {this.props.eventType === 'add' ? null : <Button bsStyle="danger" onClick={() => this.props.deleteEvent(this.state.eventDetail.id)}>Delete</Button>}
                    <Button onClick={this.props.handleHide}>Close</Button>
                </Modal.Footer>

                <Modal show={this.state.showInvitesModal}
                    onHide={this.handleInvitesHide}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">
                            {this.state.eventDetail.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Send invites according to their Blockstack settings:
                        <GuestList guests={this.state.eventDetail.guests} />
                        {this.state.sending && !this.props.inviteError && (<ProgressBar active now={50} />)}
                        {this.props.inviteError && inviteErrorMsg}
                        <Modal.Footer>
                            <Button bsStyle="success" onClick={() => this.sendInvites()}>Send</Button>
                            <Button onClick={this.handleInvitesHide}>Close</Button>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    const inviteError = state.events.inviteError
    const inviteSuccess = state.events.inviteSuccess
    console.log("events mapStateToProps", state.events)
    return {
        inviteError,
        inviteSuccess
    };
}

export default connect(mapStateToProps)(EventDetails);

