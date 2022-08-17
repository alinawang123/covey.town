import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { UserProfile } from '../../../../../../../CoveyTypes';
import usePlayersInTown from '../../../../../../../hooks/usePlayersInTown';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';

interface UserSelectInput {
    selectedUser:string;
    handleChange:(event: React.ChangeEvent<{
        value: unknown;
    }>) => void
  }

function UserSelect({selectedUser,handleChange}:UserSelectInput) {
    const { room } = useVideoContext();
    const localParticipant = room!.localParticipant;
    const players:UserProfile[]=usePlayersInTown().map((item)=>{
        return {displayName:item.userName,id:item.id}
      })
  return (
    <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">To:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedUser}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="everyone" >everyone</MenuItem>
          {players.filter(player=>{
            return player.id!=localParticipant.identity
          }).map((player)=>{
            return <MenuItem value={player.id} key={player.id}>{player.displayName}</MenuItem>
          })}
        </Select>
      </FormControl>
  )
}

export default UserSelect