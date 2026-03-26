import React from "react";

function UserSelector({ users, currentUserId, onSelect, onAddNew, onManageCountries, onSearchUser, showSearch }) {
  return (
    <div className="selectors">
      {users.map((user) => (
        <React.Fragment key={user.id}> 
          <input 
            type="radio" 
            id={user.id} 
            name="user"
            checked={currentUserId === user.id} 
            onChange={() => onSelect(user.id)} 
          />
          <label 
            htmlFor={user.id} 
            style={{ backgroundColor: user.color, cursor: 'pointer' }}
          >
            {user.name} 
          </label>
        </React.Fragment>
      ))}

      {showSearch && (
        <button type="button" id="tab" onClick={onSearchUser}>
          Search User
        </button>
      )}

      <button type="button" id="tab" onClick={onAddNew}>
        Add / Delete Member
      </button>

      <button type="button" id="tab" onClick={onManageCountries}>
        Manage Countries
      </button>
    </div>
  );
}
export default UserSelector;