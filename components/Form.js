import { useState } from "react";
import styled from "styled-components";
import StyledButton from "./StyledButton";
import { useRouter } from "next/router";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin: 1rem;
  margin-top: 6rem;
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 4.5rem;
`;

const StyledHeading = styled.h2`
  align-self: center;
`;

const StyledLabel = styled.label`
  font-size: 1.2rem;
`;

const StyledSpan = styled.span`
  font-size: 1rem;
  color: red;
  float: ${({ $left }) => ($left ? "left" : "right")};
`;

const StyledSelect = styled.select`
  padding: 0.3rem;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function Form({
  onTaskSubmit,
  title,
  value,
  isEdit,
  familyMembers,
}) {
  const router = useRouter();
  const [enteredTitle, setEnteredTitle] = useState("");
  const [isValid, setIsValid] = useState(false);

  const formattedTodayDate = new Date().toISOString().substring(0, 10);

  function handleChange(event) {
    setEnteredTitle(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    if (!data.title.trim()) {
      setIsValid(true);
      event.target.title.focus();
      return;
    }

    if (isEdit) {
      onTaskSubmit({ ...data, id: value.id, isDone: value.isDone });
      router.push(`/tasks/${value.id}`);
    } else {
      onTaskSubmit(data);
      router.push("/");
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledHeading>{title}</StyledHeading>
      <StyledLabel htmlFor="title">
        <StyledSpan $left={true}>*</StyledSpan>Title:
        {isValid && <StyledSpan>Please enter valid title!</StyledSpan>}
      </StyledLabel>
      <input
        type="text"
        id="title"
        name="title"
        maxLength="150"
        onChange={handleChange}
        defaultValue={value?.title}
      ></input>
      <StyledSpan>{150 - enteredTitle.length} characters left</StyledSpan>
      <StyledLabel htmlFor="category">Category:</StyledLabel>
      <StyledSelect
        id="category"
        name="category"
        defaultValue={value?.category}
      >
        <option value="">Please select a category</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Bills">Bills</option>
        <option value="Errands">Errands</option>
        <option value="School">School</option>
        <option value="Pets">Pets</option>
        <option value="Health">Health</option>
        <option value="Social">Social</option>
      </StyledSelect>
      <StyledLabel htmlFor="priority">Priority:</StyledLabel>
      <StyledDiv>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </StyledDiv>
      <input
        type="range"
        id="priority"
        name="priority"
        defaultValue={isEdit ? value?.priority : "1"}
        min="1"
        max="3"
      ></input>
      <StyledLabel htmlFor="dueDate">Due date:</StyledLabel>
      <input
        type="date"
        id="dueDate"
        name="dueDate"
        min={formattedTodayDate}
        defaultValue={value?.dueDate}
      ></input>
      <StyledLabel htmlFor="assignedTo">Member:</StyledLabel>
      <StyledSelect
        id="assignedTo"
        name="assignedTo"
        defaultValue={value?.assignedTo}
      >
        <option value="">Select Family Member</option>
        {familyMembers.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </StyledSelect>
      <StyledButton>{isEdit ? "Update" : "Create"}</StyledButton>
    </StyledForm>
  );
}
