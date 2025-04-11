import { useEffect, useState } from "react";
import { Entry } from "../components/EntryTable";
import api from "../api";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, Point } from "chart.js";

Chart.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title,
    Tooltip, 
    Legend
);

const Analysis = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [inflationData, setInflationData] = useState<number[]>([]);
    const [chartData, setChartData] = useState<ChartData<"line", (number | Point | null)[], unknown>>({
        labels: [],
        datasets: []
    });
    const [chartInflationData, setChartInflationData] = useState<ChartData<"line", (number | Point | null)[], unknown>>({
        labels: [],
        datasets: []
    });
    const [displayInflationChart, setDisplayInflationChart] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<Entry[]>('entries');
                const allEntries = response.data;
                allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setEntries(allEntries);

                // inflation data
                if (allEntries.length > 2) {
                    const startDate = new Date(allEntries[allEntries.length - 1].date);
                    const endDate = new Date(allEntries[0].date);

                    const currentDate = new Date();
                    const fourMonthsAgo = new Date(currentDate)
                    fourMonthsAgo.setMonth(currentDate.getMonth() - 4);
                    if (endDate > fourMonthsAgo) {
                        endDate.setMonth(endDate.getMonth() - 4);
                    }

                    const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`
                    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}`
    
                    const inflationResponse = await api.get(`proxy?startPeriod=${formattedStartDate}&endPeriod=${formattedEndDate}`);
    
                    const inflation = Object.values<number[]>(inflationResponse.data.dataSets[0].series["0:0:0:0:0:0"].observations).map((x: number[]) => x[0]);
    
                    setInflationData(inflation);
                    console.log(inflation)
                }
            } catch (error) {
                console.log('API error', error);
            }
        }

        fetchData();
    }, []);

    function getMonthsBetween(startDate: Date, endDate: Date) {
        const months = [];
        let current = new Date(startDate);
      
        while (current <= endDate) {
            months.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }

        return months;
      }

    const groupByMonth = (adjustForInflation: boolean) => {
        const startDate = new Date(entries[entries.length - 1].date);
        const endDate = new Date(entries[0].date);
        const months = getMonthsBetween(new Date(startDate), new Date(endDate));

        const groupedData = months.map(month => {
            const monthKey = month.toISOString().slice(0, 7);
            return {
                month: monthKey,
                earnings: 0,
                expenses: 0,
            };
        });

        entries.forEach(entry => {
            const entryDate = new Date(entry.date);
            const entryMonth = entryDate.toISOString().slice(0, 7);

            const monthGroup = groupedData.find(item => item.month === entryMonth);

            if (monthGroup) {
                if (adjustForInflation) {
                    const monthIndex = months.findIndex(item => item.toISOString().slice(0, 7) === entryMonth);
                    let adjustedAmount = entry.amount;
    
                    let lastInflationValue = 0;
                    for (let i = 0; i <= monthIndex; i++) {
                        if (inflationData !== undefined) {
                            adjustedAmount *= (1 + inflationData[i] / 100);
                            lastInflationValue = inflationData[i];
                        } else {
                            adjustedAmount *= (1 + lastInflationValue / 100);
                        }
                    }

                    if (entry.is_expense) {
                        monthGroup.expenses += adjustedAmount;
                    } else {
                        monthGroup.earnings += adjustedAmount;
                    }
                } else {
                    if (entry.is_expense) {
                        monthGroup.expenses += entry.amount;
                    } else {
                        monthGroup.earnings += entry.amount;
                    }
                }
            }
        });
      
        return groupedData;
    }

    const formatDataForChart = (adjustForInflation: boolean) => {
        const groupedData = groupByMonth(adjustForInflation);
        const labels = groupedData.map(item => item.month);
        const incomeData = groupedData.map(item => item.earnings);
        const expensesData = groupedData.map(item => item.expenses);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.3)',
                    fill: false
                },
                {
                    label: 'Expenses',
                    data: expensesData,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    fill: false
                }
            ]
        };
    }

    const options = {
        responsive: true,
        scales: {
            y: {
            beginAtZero: true
            },
        },
    };

    useEffect(() => {
        if (entries.length != 0) {
            setChartData(formatDataForChart(false));
        }
    }, [entries])

    useEffect(() => {
        if (inflationData.length != 0) {
            setChartInflationData(formatDataForChart(true));
        }
    }, [inflationData])

    return (
        <div className="m-auto w-auto text-center align-middle p-5">
            <h1>
                Displaying data { displayInflationChart ? '' : 'not' } adjusted for inflation
                <button className="btn btn-lg btn-seconday" onClick={() => setDisplayInflationChart(!displayInflationChart)}>Change</button>
            </h1>

            { entries.length > 2 ? 
                <>
                    <Line data={displayInflationChart ? chartInflationData : chartData} options={options} />
                    <h3>Inflation data from the <a href="https://data.ecb.europa.eu/help/api/data">European Central Bank</a></h3>
                    <h3>Keep in mind that the data may not be available for the most recent months</h3>
                </> :
                <h1>Not enough data</h1>
            }
        </div>
    )
}

export default Analysis;