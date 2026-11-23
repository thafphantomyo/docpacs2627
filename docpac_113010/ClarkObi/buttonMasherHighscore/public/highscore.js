fetch('/api/scores')
    .then(respone=>respone.json())
    .then(data =>{
        const highscoreTable =document.getElementById('highscoreTable')
        let rank=1
        data.forEach(scoreObject => {
            const row = document.createElement('tr')
            const rankCell=document.createElement('td')
            const nameCell=document.createElement('td')
            const scoreCell=document.createElement('td')
            rankCell.textContent=rank
            nameCell.textContent=scoreObject.name
            scoreCell.textContent=scoreObject.score
            rank=rank+1
            row.appendChild(rankCell)
            row.appendChild(nameCell)
            row.appendChild(scoreCell)
            highscoreTable.appendChild(row)
        });
    })