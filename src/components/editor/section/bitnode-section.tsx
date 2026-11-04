import { useContext } from "react";
import { observer } from "mobx-react-lite";

import { FileContext } from "App";
import { Input } from "components/inputs/input";

function getCompletions(sourceFiles: unknown, bitNodeN: number): number {
  if (Array.isArray(sourceFiles)) {
    return sourceFiles.find((sourceFile) => sourceFile.n === bitNodeN)?.lvl ?? 0;
  }

  const map = sourceFiles as { data?: [number, number][] } | undefined;
  return map?.data?.find((sourceFile) => sourceFile[0] === bitNodeN)?.[1] ?? 0;
}

export default observer(function BitNodeSection() {
  const { bitnode } = useContext(FileContext);
  const bitNodeN = bitnode.data.bitNodeN ?? 1;
  const completions = getCompletions(bitnode.data.sourceFiles, bitNodeN);

  const update = (nextBitNodeN: number, nextCompletions: number) => {
    if (!Number.isFinite(nextBitNodeN) || !Number.isFinite(nextCompletions)) return;
    bitnode.updateBitNode(
      Math.max(1, Math.floor(nextBitNodeN)),
      Math.max(0, Math.floor(nextCompletions))
    );
  };

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="rounded border border-gray-700 shadow shadow-green-700 p-4 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100">BitNode</h2>
          <p className="text-sm text-gray-400">Choose the active BitNode and how many times it has been completed.</p>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-gray-300">Subnode</span>
          <Input
            type="number"
            min={1}
            step={1}
            value={bitNodeN}
            onChange={(event) => {
              const nextBitNodeN = Number(event.currentTarget.value);
              update(nextBitNodeN, getCompletions(bitnode.data.sourceFiles, nextBitNodeN));
            }}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-gray-300">Times completed</span>
          <Input
            type="number"
            min={0}
            step={1}
            value={completions}
            onChange={(event) => update(bitNodeN, Number(event.currentTarget.value))}
          />
        </label>
      </div>
    </div>
  );
});