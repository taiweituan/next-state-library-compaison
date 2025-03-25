import React from "react"

const Instruction: React.FC = ({}) => {
  return (
    <div className="text-left">
      <div className="mb-2 text-[11px] text-gray-500">
        ℹ️ Enable <b>"Highlight updates when components render”</b> checkbox in React DevTools to see the re-renders.
        <ol className="my-3 list-disc px-4">
          <li>Update user name. Click on text to edit it.</li>
          <li>Switch light/dark mode.(Not functional in this demo)</li>
          <li>Add todo item(s). Click on the text to toggle completion. Click on the ❌ button to delete.</li>
        </ol>
      </div>
      <hr className="my-4" />
    </div>
  )
}

export default Instruction
