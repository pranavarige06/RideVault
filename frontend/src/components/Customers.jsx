import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Customers() {

  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {

    const auth =
      localStorage.getItem("ridevaultAuth");

    try {

      const response = await fetch(
        "http://localhost:8080/customers",
        {
          headers: {
            "Authorization": "Basic " + auth
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load customers"
        );
      }

      const data =
        await response.json();

      setCustomers(data);

    } catch (error) {

      console.log(
        "Error loading customers:",
        error
      );

    }
  }


  async function addCustomer() {

    if (!name || !email || !phone) {

      alert(
        "Please fill all fields."
      );

      return;
    }

    const auth =
      localStorage.getItem("ridevaultAuth");

    const newCustomer = {
      name: name,
      email: email,
      phone: phone
    };

    try {

      const response = await fetch(
        "http://localhost:8080/customers",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + auth
          },

          body: JSON.stringify(
            newCustomer
          )
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to add customer"
        );
      }

      const data =
        await response.json();

      setCustomers([
        ...customers,
        data
      ]);

      setName("");
      setEmail("");
      setPhone("");

      alert(
        "Customer added successfully!"
      );

    } catch (error) {

      console.log(
        "Error adding customer:",
        error
      );

      alert(
        "Failed to add customer."
      );
    }
  }


  function editCustomer(customer) {

    setEditingId(customer.id);

    setName(customer.name);

    setEmail(customer.email);

    setPhone(customer.phone);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  async function updateCustomer() {

    if (!name || !email || !phone) {

      alert(
        "Please fill all fields."
      );

      return;
    }

    const auth =
      localStorage.getItem("ridevaultAuth");

    const updatedCustomer = {

      name: name,

      email: email,

      phone: phone
    };

    try {

      const response = await fetch(
        `http://localhost:8080/customers/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + auth
          },

          body: JSON.stringify(
            updatedCustomer
          )
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to update customer"
        );
      }

      const data =
        await response.json();

      setCustomers(
        customers.map(
          (customer) =>
            customer.id === editingId
              ? data
              : customer
        )
      );

      setEditingId(null);

      setName("");

      setEmail("");

      setPhone("");

      alert(
        "Customer updated successfully!"
      );

    } catch (error) {

      console.log(
        "Error updating customer:",
        error
      );

      alert(
        "Failed to update customer."
      );
    }
  }


  function cancelEdit() {

    setEditingId(null);

    setName("");

    setEmail("");

    setPhone("");
  }


  async function deleteCustomer(id) {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this customer?"
      );

    if (!confirmDelete) {
      return;
    }

    const auth =
      localStorage.getItem("ridevaultAuth");

    try {

      const response = await fetch(
        `http://localhost:8080/customers/${id}`,
        {
          method: "DELETE",

          headers: {
            "Authorization":
              "Basic " + auth
          }
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to delete customer"
        );
      }

      const result =
        await response.text();

      console.log(
        "Delete response:",
        result
      );

      setCustomers(
        customers.filter(
          (customer) =>
            customer.id !== id
        )
      );

      alert(
        "Customer deleted successfully!"
      );

    } catch (error) {

      console.log(
        "Error deleting customer:",
        error
      );

      alert(
        "Failed to delete customer."
      );
    }
  }


  // ================================
  // CUSTOMER SEARCH
  // ================================

  const filteredCustomers =
    customers.filter(
      (customer) => {

        const search =
          searchTerm
            .toLowerCase()
            .trim();

        return (
          customer.name
            .toLowerCase()
            .includes(search) ||

          customer.email
            .toLowerCase()
            .includes(search) ||

          customer.phone
            .toLowerCase()
            .includes(search)
        );
      }
    );


  return (

    <div className="management-page">

      <div className="management-header">

        <div>

          <h1>
            👥 Customer Management
          </h1>

          <p>
            Manage all registered
            RideVault customers.
          </p>

        </div>

        <Link
          to="/dashboard"
          className="back-button"
        >
          ← Dashboard
        </Link>

      </div>


      {/* CUSTOMER FORM */}

      <div className="customer-form-card">

        <h2>

          {editingId
            ? "✏️ Edit Customer"
            : "➕ Add New Customer"}

        </h2>


        <div className="customer-form">

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="e.g. Rahul Kumar"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="e.g. rahul@gmail.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="text"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

          </div>

        </div>


        <div className="form-buttons">

          {editingId ? (

            <>

              <button
                className="update-button"
                onClick={
                  updateCustomer
                }
              >
                Update Customer
              </button>


              <button
                className="cancel-button"
                onClick={
                  cancelEdit
                }
              >
                Cancel
              </button>

            </>

          ) : (

            <button
              className="add-button"
              onClick={
                addCustomer
              }
            >
              Add Customer
            </button>

          )}

        </div>

      </div>


      {/* CUSTOMER LIST */}

      <div className="customer-list-section">


        <div className="section-heading">

          <div>

            <h2>
              Customers
            </h2>

          </div>


          <span className="customer-count">

            {filteredCustomers.length}
            {" "}
            customer
            {filteredCustomers.length !== 1
              ? "s"
              : ""}

          </span>

        </div>


        {/* SEARCH BAR */}

        <div className="customer-search">

          <input
            type="text"
            placeholder="🔍 Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>


        {filteredCustomers.length === 0 ? (

          <div className="empty-state">

            <div>
              👤
            </div>

            <h3>

              {searchTerm
                ? "No Customers Found"
                : "No Customers Found"}

            </h3>

            <p>

              {searchTerm
                ? "Try a different search."
                : "Add your first customer using the form above."}

            </p>

          </div>

        ) : (

          <div className="customer-grid">

            {filteredCustomers.map(
              (customer) => (

                <div
                  className="customer-card"
                  key={customer.id}
                >

                  <div className="customer-icon">
                    👤
                  </div>


                  <h3>
                    {customer.name}
                  </h3>


                  <div className="customer-detail">

                    <span>
                      🆔
                    </span>

                    <p>
                      Customer ID: {customer.id}
                    </p>

                  </div>


                  <div className="customer-detail">

                    <span>
                      📧
                    </span>

                    <p>
                      {customer.email}
                    </p>

                  </div>


                  <div className="customer-detail">

                    <span>
                      📱
                    </span>

                    <p>
                      {customer.phone}
                    </p>

                  </div>


                  <div className="customer-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        editCustomer(
                          customer
                        )
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteCustomer(
                          customer.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Customers;