import {
  config,
  publicKeyToAddress,
  getPublicKeyFromPrivate,
  resolveZoneFileToProfile,
  putFile,
  loadUserData,
} from 'blockstack'
import { createClient } from 'matrix-js-sdk'

export class UserSessionChat {
  constructor(selfRoomId) {
    this.selfRoomId = selfRoomId
    this.matrixClient = createClient('https://openintents.modular.im')
  }

  getOTP(userData) {
    const appUserAddress = publicKeyToAddress(
      getPublicKeyFromPrivate(userData.appPrivateKey)
    )
    var txid = userData.identityAddress + '' + Math.random()
    console.log('txid', txid)
    return fetch('https://auth.openintents.org/c/' + txid, { method: 'POST' })
      .then(
        response => {
          return response.json()
        },
        error => console.log('error', error)
      )
      .then(c => {
        const challenge = c.challenge
        console.log('challenge', challenge)
        return putFile('mxid.json', challenge, { encrypt: false }).then(
          () => {
            return {
              username: appUserAddress.toLowerCase(),
              password:
                txid + '|' + window.location.origin + '|' + userData.username,
            }
          },
          error => console.log('err2', error)
        )
      })
  }

  setOnMessageListener(onMsgReceived) {
    const matrixClient = this.matrixClient
    if (onMsgReceived) {
      return this.login().then(
        () => {
          matrixClient.on('Room.timeline', onMsgReceived)
          matrixClient.startClient()
          console.log('event listeners are setup')
        },
        err => {
          console.log('login failed', err)
        }
      )
    } else {
      console.log('user id ', matrixClient.getUserId())
      if (matrixClient.getUserId()) {
        matrixClient.stopClient()
      }
    }
  }

  createNewRoom(name, topic, guests, ownerIdentityAddress) {
    console.log('createNewRoom', { name, topic, guests, ownerIdentityAddress })
    const matrix = this.matrixClient
    return this.login().then(() => {
      let invitePromises
      if (guests) {
        invitePromises = guests.map(g => {
          return this.lookupProfile(g).then(
            guestProfile => {
              return this.addressToAccount(guestProfile.identityAddress)
            },
            error => {
              console.log('failed to lookup guest', g, error)
            }
          )
        })
      } else {
        invitePromises = []
      }
      return Promise.all(invitePromises).then(
        invite => {
          if (ownerIdentityAddress) {
            invite.push(this.addressToAccount(ownerIdentityAddress))
          }
          console.log('creating room', { invite })
          return matrix.createRoom({
            visibility: 'private',
            name,
            topic,
            invite,
          })
        },
        error => {
          console.log('failed to resolve guests ', error)
        }
      )
    })
  }

  sendMessage(receiverName, roomId, content) {
    return this.lookupProfile(receiverName).then(receiverProfile => {
      console.log('receiver', receiverProfile)
      const receiverMatrixAccount = this.addressToAccount(
        receiverProfile.identityAddress
      )
      content.formatted_body = content.formatted_body.replace(
        '<subjectlink/>',
        '<a href="https://matrix.to/#/' +
          receiverMatrixAccount +
          '">' +
          receiverProfile.identityAddress +
          '</a>'
      )
      const matrixClient = this.matrixClient

      return this.login().then(() => {
        return matrixClient.joinRoom(roomId, {}).then(data => {
          console.log('data join', data)
          return matrixClient
            .invite(roomId, receiverMatrixAccount)
            .finally(() => {
              if (receiverProfile.appUserAddress) {
                return matrixClient
                  .invite(
                    roomId,
                    this.addressToAccount(receiverProfile.appUserAddress)
                  )
                  .finally(res => {
                    return matrixClient
                      .sendEvent(roomId, 'm.room.message', content, '')
                      .then(res => {
                        console.log('msg sent', res)
                        return Promise.resolve(res)
                      })
                  })
              } else {
                return matrixClient
                  .sendEvent(roomId, 'm.room.message', content, '')
                  .then(res => {
                    console.log('msg sent', res)
                    return Promise.resolve(res)
                  })
              }
            })
        })
      })
    })
  }

  sendMessageToSelf(content) {
    const matrixClient = this.matrixClient
    return this.login().then(() => {
      console.log('logged in')
      return this.getSelfRoom().then(
        ({ selfRoomId }) => {
          console.log('self room id', selfRoomId)
          return matrixClient.joinRoom(selfRoomId, {}).then(
            data => {
              console.log('data join', data)
              return matrixClient
                .sendEvent(selfRoomId, 'm.room.message', content, '')
                .then(
                  res => {
                    console.log('msg sent', res)
                    return Promise.resolve(res)
                  },
                  error => console.log('failed to send', error)
                )
            },
            error => console.log('failed to join', error)
          )
        },
        error => console.log('failed to get self room', error)
      )
    })
  }

  /**
   * Private Methods
   **/

  login() {
    if (this.matrixClient.getUserId()) {
      return Promise.resolve()
    } else {
      const userData = loadUserData()
      return this.getOTP(userData).then(result => {
        var deviceDisplayName = userData.username + ' via OI Calendar'
        console.log(
          'login',
          deviceDisplayName,
          result.username,
          result.password
        )
        return this.matrixClient.login('m.login.password', {
          identifier: {
            type: 'm.id.user',
            user: result.username,
          },
          user: result.username,
          password: result.password,
          initial_device_display_name: deviceDisplayName,
        })
      })
    }
  }

  getSelfRoom() {
    if (this.selfRoomId) {
      return Promise.resolve({ selfRoomId: this.selfRoomId })
    } else {
      console.log('no self room id')
      return Promise.reject(new Error('No room for user notifications defined'))
    }
  }

  addressToAccount(address) {
    // TODO lookup home server for user
    return '@' + address.toLowerCase() + ':openintents.modular.im'
  }

  lookupProfile(username) {
    if (!username) {
      return Promise.reject(new Error('Invalid username'))
    }
    console.log('username', username)
    let lookupPromise = config.network.getNameInfo(username)
    return lookupPromise.then(responseJSON => {
      if (
        responseJSON.hasOwnProperty('zonefile') &&
        responseJSON.hasOwnProperty('address')
      ) {
        let profile = {}
        profile.identityAddress = responseJSON.address
        return resolveZoneFileToProfile(
          responseJSON.zonefile,
          responseJSON.address
        ).then(pr => {
          console.log('pr', pr)
          if (pr.apps[window.location.origin]) {
            const gaiaUrl = pr.apps[window.location.origin]
            const urlParts = gaiaUrl.split('/')
            profile.appUserAddress = urlParts[urlParts.length - 2]
          }
          return profile
        })
      } else {
        throw new Error(
          'Invalid zonefile lookup response: did not contain `address`' +
            ' or `zonefile` field'
        )
      }
    })
  }
}

export function createSessionChat(selfRoomId) {
  return new UserSessionChat(selfRoomId)
}
