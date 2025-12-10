import React from 'react';
import Papa from 'papaparse';
import { Point } from '@/model/model.ts';
import { transformNumberArrayToDimensions } from '@/components/menu/csv.helper.ts';
import { useWindowSize } from '@/App.tsx';

interface CsvRow {
	[key: string]: string;
}

const CsvUploader = ({ setPath }: { setPath: (path: Point[]) => void }) => {
	const { width, height } = useWindowSize();

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		Papa.parse<CsvRow>(file, {
			delimiter: ';',
			header: false,
			skipEmptyLines: true,
			dynamicTyping: true,
			complete: (result) => {
				let inputPathData: number[][] = result.data
					.map((row) => {
						const values = Object.values(row).map(Number);
						return [values[0], values[1]];
					})
					.filter(([x, y]) => !isNaN(x) && !isNaN(y));

				if (result.data.length > 1000) {
					let pathLength = result.data.length;
					while (pathLength > 1000) {
						inputPathData = shrinkPathData(inputPathData);
						pathLength = inputPathData.length;
					}
				}

				const path = transformNumberArrayToDimensions(
					inputPathData,
					width,
					height,
				);
				if (path) {
					setPath(path);
				}
			},
		});
	};

	const shrinkPathData = (inputPathData: number[][]) => {
		const newPath: number[][] = [];
		for (let i = 0; i < inputPathData.length; i++) {
			if (i % 2 === 0) {
				newPath.push(inputPathData[i]);
			}
		}
		return newPath;
	};

	return (
		<div className={' flex flex-col mt-3'}>
			<span className={'text-black'}>
				You can upload a .csv file where x and y coordinates are seperated with
				a ';' delimiter.
			</span>
			<input
				className={'cursor-pointer ml-20 mt-4'}
				type="file"
				accept=".csv"
				onChange={handleFileUpload}
			/>
		</div>
	);
};

export default CsvUploader;
