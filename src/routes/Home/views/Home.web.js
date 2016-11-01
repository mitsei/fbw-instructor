
import React from 'react'
let moment = require('moment')

import LoadingBox from '../../../components/LoadingBox'
import DashboardContainer from '../../Dashboard/'
import MissionControlContainer from '../../MissionControl/'

import BASE_STYLES from '../../../styles/baseStyles'

let styles = {
  bankCollection: {
    listStyle: 'none',
    marginLeft: 0
  },
  rowItem: {
    fontSize: '.875rem',
    padding: '.75rem 0 .125rem 1em',
    textAlign: 'left',
    cursor: 'pointer',
  },
  rowItemTitle: {
    fontWeight: "500"
  },
  rowItemSubtitle: {
    fontSize: '.9em',
    color: '#555'
  },
  bankCollectionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: '#ddd',
    ":hover": {
      backgroundColor: '#f8f8f8'
    }
  },
  selectedBankItem: {
    backgroundColor: '#f0f0f0',
    ":hover": {
      cursor: 'default',
      backgroundColor: '#f0f0f0'
    }
  },
  missionCollection: {
    listStyle: 'none',
    marginLeft: 0
  },
  missionCollectionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderColor: '#ddd',
    textAlign: 'left',
    ":hover": {
      backgroundColor: '#f8f8f8'
    }
  },
  selectedMissionItem: {
    backgroundColor: '#f0f0f0',
    ":hover": {
      cursor: 'default',
      backgroundColor: '#f0f0f0'
    }
  },
  rowItemInfo: {
    flex: 3
  },
  rowItemButtons: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  },
  dateText: {
  },
  date: {
    fontWeight: '500'
  }
}

export const HomeViewWeb = (props) => {

  let view;
  if (props.view.name.startsWith('dashboard')) {
    view = (
      <div>
        <DashboardContainer.component></DashboardContainer.component>
      </div>
    )
  } else if (props.view.name === 'add-mission' || props.view.name === 'edit-mission') {
    view = (
      <div>
        <MissionControlContainer.component></MissionControlContainer.component>
      </div>
    )
  }

  let createMissionButton = <div />
  if (props.currentBank) {
    createMissionButton = <button className="button" onClick={() => props.onClickAddMission()}>Create a mission</button>
  }

  let missionCollection;
  if (!props.isGetMissionsInProgress) {
    missionCollection = (
      <ul key="missionCollection" style={styles.missionCollection}>
      {_.map(props.missions, (mission, idx) => {
          let key = `mission_${idx}`;
          let selectedStyle = (props.currentMission && mission.id === props.currentMission.id) ? styles.selectedMissionItem : null;

          // @Cole can you take a look at this?
          // let editMissionButton;
          // // console.log(moment(mission.deadline).isBefore(moment()));
          // if (moment(mission.deadline).isBefore(moment()) ) {
          //   editMissionButton =  (<button className="button small" style={styles.rowItemButton}
          //             onClick={(e) => {props.onClickEditMission(mission); e.stopPropagation()}}>Edit</button>)
          // }

          return (
            <li key={key} style={[styles.rowItem, styles.missionCollectionItem, selectedStyle]} onClick={() => props.onClickMission(mission)}>
              <div style={styles.rowItemInfo}>
                <p style={styles.rowItemTitle}>{mission.displayName.text}</p>
                <p style={styles.rowItemSubtitle}>
                  <span style={styles.dateText}>From </span>
                  <span style={styles.date}>{moment(mission.startTime).format('dddd MMM D')} </span>
                  <span style={styles.dateText}>to </span>
                  <span style={styles.date}>{moment(mission.deadline).format('dddd MMM D')}</span>
                  </p>
              </div>
              {/* <div style={styles.rowItemButtons}>
                {editMissionButton}
              </div> */}
            </li>
          )
        })}
      </ul>
    )
  }

  // if there are no missions, and we aren't loading, display an empty box
  let missionsLoadingBox;
  if (!props.isGetMissionsInProgress) {
    missionsLoadingBox = LoadingBox('enter')

  } else if (props.isGetMissionsInProgress && !props.mission) {
    missionsLoadingBox = LoadingBox('enter-active')
  }

  return (
    <div className="row">
      <div className="medium-4 large-3 columns"  style={styles.sidebar}>
        <ul style={styles.bankCollection}>
          {_.map(props.banks, (bank, idx) => {
            let key = `bank_${idx}`;
            let selectedStyle = (props.currentBank && bank.id === props.currentBank.id) ?
                                styles.selectedBankItem : null;

            return (
              <li key={key} style={[styles.rowItem, styles.bankCollectionItem, selectedStyle]}
                            onClick={() => props.onClickBank(bank)}>
                <div style={styles.rowItemInfo}>
                  <p style={styles.rowItemTitle}>{bank.displayName.text}</p>
                  <p style={styles.rowItemSubtitle}>{bank.description.text}</p>
                </div>
              </li>
            )
          })}
        </ul>



        {createMissionButton}

        {missionCollection}
        {missionsLoadingBox}
      </div>

      <div className="medium-8 large-9 columns">
        {view}
      </div>


    </div>
  )
}
