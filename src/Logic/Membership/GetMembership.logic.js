import {useState, useEffect, useCallback } from 'react'
import client from '../../appwrite.config.js'
import { Teams } from 'appwrite' 

function GetMembershipLogic() {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [teams, setTeams] = useState(null)
    const [teamsCount, setTeamsCount] = useState(0)

    const getUserTeams = useCallback(async () => {
        try {
            setLoading(prev => true)
            const teams = new Teams(client)
            const response = await teams.list()
            setTeams(prev =>response.teams)
            setTeamsCount(prev => response.total)        
        }
        catch(err) {
            
        }
        finally {
            setLoading(prev => false)
        }
    }, [])

    useEffect(() => {
        getUserTeams()
    } , [getUserTeams])

    const deleteInvitation = async ({membershipId, teamId}) => {
        const teams = new Teams(client)
        const response = await teams.deleteMembership(teamId, membershipId)
        return response   
    }

    return { loading, error, teams, teamsCount, deleteInvitation }
  
}

export default GetMembershipLogic