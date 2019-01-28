
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {ProgressBar} from 'react-bootstrap'

function renderGuestList(guests) {
    var list = []
    for (var property in guests) {
        if (guests.hasOwnProperty(property)) {
            var guest = guests[property]
            guest.username = property
            console.log("g", guest)
            list.push((<Guest key={property} guest={guest} />))
        }
    }
    return list;
}

const Guest = ({ guest }) => {
    console.log("UI guest", guest)
    const guestUrl = "https://debutapp.social/" + guest.username
    return (
        <div>
            <a href={guestUrl}>{guest.name}</a>
        </div>
    );
};

class GuestList extends Component {
    render() {
        console.log("UI props", this.props)
        var guests
        if (this.props.guests) {
            guests = renderGuestList(this.props.guests);
        } else {
            guests = (<div>loading guests' details..<br/><ProgressBar active now={50}/></div>)
        }

        return (
            <section>
                {guests}
            </section>
        );
    }
}


function mapStateToProps(state) {
    var { events } = state
    const guests = events.currentGuests
    return {
        guests
    };
}

export default connect(mapStateToProps)(GuestList);
