import 'zx/globals'
import ids from './machine-ids.json' assert { type: "json" };
import { makeApiRequest } from "./request.mjs"

const token = 'ey...'

for (let machineId of ids) {
    const res = await makeApiRequest(`https://api-eu.securitycenter.windows.com/api/machines/${machineId}/tags`, {
        method: "POST",
        headers: {
            Authorization: `bearer ${token}`,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({Value: "Duplicate - Inactive", Action: "Add"})
    })

    console.log(await res.text())
}
