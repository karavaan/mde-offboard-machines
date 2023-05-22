import 'zx/globals'
import ids from './machine-ids.json' assert { type: "json" };
import { makeApiRequest } from "./request.mjs"

const token = 'ey...'
const comment = 'This device has been offboarded through the API'

const offboardedMachines = [];
const failedAttempts = [];

for (let machineId of ids) {
    const response = await makeApiRequest(`https://api-eu.securitycenter.windows.com/api/machines/${machineId}/offboard`, {
        method: "POST",
        headers: {
             Authorization: `bearer ${token}`,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({Comment: comment})
    })

    if (response.status === 201) {
        const responseBody = await response.json();
        const computerDnsName = responseBody.computerDnsName;
        offboardedMachines.push({ machineId, computerDnsName });
    } else {
        const message = await response.text()
        failedAttempts.push({
            machineId,
            status: response.status,
            message,
        });
    }

    const formatEntry = (entry) => `- Machine ID: ${entry.machineId}, Status: ${entry.status}, Message: ${entry.message}`;

    const content = `Offboarded Machines:\n${offboardedMachines.map(({ machineId, computerDnsName }) => `- Machine ID: ${machineId}, Computer DNS Name: ${computerDnsName}`).join('\n')}\n\nFailed Attempts:\n${failedAttempts.map(formatEntry).join('\n')}`;

    fs.writeFileSync('result.txt', content);

    const summary = [
        chalk.green(`Successfully offboarded machines: ${offboardedMachines.length}`),
        chalk.red(`Failed attempts: ${failedAttempts.length}`),
        `Detailed results can be viewed in the following files:`,
        `- result.txt`,
    ].join('\n');

    console.log(summary);
}
