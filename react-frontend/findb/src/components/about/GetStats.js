import axios from 'axios'
import { useState, useEffect } from 'react'


function GetStats(props) {
    return (
        <div>
            <GetCommits forTeam={props.forTeam} user={props.user}></GetCommits>
            <GetIssues forTeam={props.forTeam} user={props.user}></GetIssues>
        </div>
    );
}


function GetCommits(props) {
    const [numCommits, setNumCommits] = useState(0);
    let urlName = ""

    // Axios call to retrieve gitlab stats
    useEffect(() => {
        if (props.forTeam) {
            urlName = 'https://gitlab.com/api/v4/projects/59294372/repository/commits?per_page=100';
        } else {
            urlName = 'https://gitlab.com/api/v4/projects/59294372/repository/commits?per_page=100&author=';
        }

        axios({
            url: urlName + props.user,
            method: "GET",
            headers: {
                "PRIVATE-TOKEN": "glpat-JxxbkJz3CrzAmUYCoF8U",
            },
        }).then(res => {
            setNumCommits(numCommits + res.data.length)
        });
    }, [])

    if (props.forTeam) {
        return (
            <li><strong>Total No. of Commits:</strong> {numCommits}</li>
        );
    }
    return (
        <li><strong>No. of Commits:</strong> {numCommits}</li>
    );
}

function GetIssues(props) {
    const [numIssues, setNumIssues] = useState(0);
    let urlName = ""


    useEffect(() => {
        if (props.forTeam) {
            urlName = 'https://gitlab.com/api/v4/projects/59294372/issues_statistics?per_page=100'
        } else {
            urlName = 'https://gitlab.com/api/v4/projects/59294372/issues_statistics?per_page=100&author_username='
        }

        axios({
            url: urlName + props.user,
            method: "GET",
            headers: {
                "PRIVATE-TOKEN": "glpat-JxxbkJz3CrzAmUYCoF8U"
            },
        })
            .then(res => {
                setNumIssues(numIssues + res.data.statistics.counts.all)
            }).catch(err => console.log(err))
    }, [])

    if (props.forTeam) {
        return (
            <li><strong>Total No. of Issues:</strong> {numIssues}</li>
        );
    }
    return (
        <li><strong>No. of Issues:</strong> {numIssues}</li>
    );
}

function GetUnitTests(props) {
    const [numUnitTests, setNumUnitTests] = useState("")
    let urlName = ""
    if (props.forTeam) {
        urlName = ''
    } else {
        urlName = ''
    }

    axios({
        url: urlName + props.user,
        method: "GET",
        headers: {
            "PRIVATE-TOKEN": "glpat-JxxbkJz3CrzAmUYCoF8U"
        },
    })
        .then(res => {
            setNumUnitTests(res.data.length)
        }).catch(err => console.log(err))

    if (props.forTeam) {
        return (
            <li><strong>Total No. of Unit Tests:</strong> {numUnitTests}</li>
        );
    }

    return (
        <li><strong>No. of Unit Tests:</strong> {numUnitTests}</li>
    );
}

export default GetStats;